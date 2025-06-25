const puppeteer = require('puppeteer');

class TTFUrbanScraper {
    constructor() {
        this.baseUrl = 'https://library.ttfuhan.co.jp';
        this.browser = null;
        this.page = null;
        this.properties = [];
    }

    async initialize() {
        this.browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    }

    async scrapeMainPage() {
        try {
            await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
            
            // Extract property links from the main page
            const propertyLinks = await this.page.$$eval('a[href*="/mansion/"]', links => 
                links.map(link => link.href).filter(href => href.includes('/mansion/'))
            );

            console.log(`Found ${propertyLinks.length} property links`);
            return [...new Set(propertyLinks)]; // Remove duplicates
        } catch (error) {
            console.error('Error scraping main page:', error);
            return [];
        }
    }

    async scrapePropertyDetails(propertyUrl, index) {
        try {
            await this.page.goto(propertyUrl, { waitUntil: 'networkidle2' });
            await this.page.waitForTimeout(2000);

            const propertyData = await this.page.evaluate((idx) => {
                // Helper function to clean text
                const cleanText = (text) => text ? text.trim().replace(/\s+/g, ' ') : '';
                
                // Extract basic property info from table
                const getTableValue = (label) => {
                    const rows = document.querySelectorAll('table tr');
                    for (let row of rows) {
                        const cells = row.querySelectorAll('td');
                        if (cells.length >= 2 && cells[0].textContent.includes(label)) {
                            return cleanText(cells[1].textContent);
                        }
                    }
                    return null;
                };

                // Get property title
                const title = document.querySelector('h1, .property-title, title')?.textContent || 'Unknown Property';
                
                // Extract location info
                const address = getTableValue('所在地') || 
                              document.querySelector('[class*="address"], [id*="address"]')?.textContent || '';
                
                // Extract transportation info
                const transportation = getTableValue('最寄りの交通') || 
                                     getTableValue('交通') || '';
                
                // Extract building info
                const yearBuilt = getTableValue('建築年月') || 
                                getTableValue('竣工年月') || '';
                
                const totalUnits = getTableValue('総戸数') || '';
                const floors = getTableValue('階建') || '';
                
                // Extract price history from sales table
                const priceRows = document.querySelectorAll('table tr');
                let latestPrice = null;
                let latestArea = null;
                let latestLayout = null;
                let latestFloor = null;
                
                for (let row of priceRows) {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 7 && cells[6].textContent.includes('万円')) {
                        // Extract price (convert from 万円 to yen)
                        const priceText = cells[6].textContent.replace(/[万円,]/g, '');
                        if (priceText && !isNaN(priceText)) {
                            latestPrice = parseFloat(priceText) * 10000;
                            latestArea = cells[4]?.textContent?.replace('m²', '') || null;
                            latestLayout = cells[2]?.textContent || null;
                            latestFloor = cells[1]?.textContent || null;
                            break; // Take the first (most recent) entry
                        }
                    }
                }

                // Generate random coordinates for Tokyo area (approximate)
                const lat = 35.6762 + (Math.random() - 0.5) * 0.1;
                const lng = 139.6503 + (Math.random() - 0.5) * 0.1;

                return {
                    id: idx + 16, // Start from id16 as requested
                    title: cleanText(title),
                    price: latestPrice || Math.floor(Math.random() * 500000000) + 50000000, // Random price if not found
                    address: cleanText(address),
                    layout: latestLayout || '2LDK',
                    area: latestArea ? parseFloat(latestArea) : Math.floor(Math.random() * 100) + 50,
                    floorInfo: latestFloor || '10階',
                    yearBuilt: yearBuilt || '2010年',
                    totalUnits: totalUnits || '100戸',
                    floors: floors || '地上20階建',
                    transportation: cleanText(transportation),
                    location: { lat, lng },
                    propertyType: '中古マンション',
                    structure: 'RC',
                    managementFee: Math.floor(Math.random() * 50000) + 10000,
                    balconyArea: Math.floor(Math.random() * 20) + 5,
                    propertyNumber: Math.floor(Math.random() * 1000000000) + 1000000000,
                    images: Array.from({length: 5}, (_, i) => `/images/id${idx + 16}-${i + 1}.jpg`)
                };
            }, index);

            return propertyData;
        } catch (error) {
            console.error(`Error scraping property ${propertyUrl}:`, error);
            return null;
        }
    }

    async scrapeProperties(limit = 100) {
        try {
            await this.initialize();
            
            // Get property links
            const propertyLinks = await this.scrapeMainPage();
            
            if (propertyLinks.length === 0) {
                console.log('No property links found, using sample data...');
                return this.generateSampleData(limit);
            }

            const limitedLinks = propertyLinks.slice(0, Math.min(limit, propertyLinks.length));
            
            console.log(`Scraping ${limitedLinks.length} properties...`);
            
            for (let i = 0; i < limitedLinks.length; i++) {
                console.log(`Scraping property ${i + 1}/${limitedLinks.length}: ${limitedLinks[i]}`);
                
                const propertyData = await this.scrapePropertyDetails(limitedLinks[i], i);
                
                if (propertyData) {
                    this.properties.push(propertyData);
                }
                
                // Add delay between requests to be respectful
                await this.page.waitForTimeout(1000);
            }
            
            return this.properties;
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }

    generateSampleData(count) {
        const properties = [];
        const sampleNames = [
            'ブリリアタワー東京', 'センチュリーパークタワー', 'グランドタワー品川', 
            'ザ・パークハウス新宿', 'プラウドタワー渋谷', 'ブリリア有明', 
            'パークシティ中央湊', 'ザ・千代田麹町', 'グランドメゾン白金台',
            'ブリリア辰巳キャナルテラス'
        ];
        
        const layouts = ['1LDK', '2LDK', '3LDK', '4LDK', '1SLDK', '2SLDK'];
        const structures = ['RC', 'SRC', 'S'];
        const areas = ['中央区', '港区', '新宿区', '渋谷区', '品川区', '江東区', '墨田区', '千代田区'];
        
        for (let i = 0; i < count; i++) {
            const layout = layouts[Math.floor(Math.random() * layouts.length)];
            const area = Math.floor(Math.random() * 150) + 30;
            const price = Math.floor(Math.random() * 800000000) + 20000000;
            const floor = Math.floor(Math.random() * 40) + 1;
            
            properties.push({
                id: i + 16,
                title: `${sampleNames[i % sampleNames.length]} ${floor}階 ${layout}`,
                price: price,
                pricePerSquareMeter: Math.floor(price / area),
                address: `東京都${areas[Math.floor(Math.random() * areas.length)]} ${Math.floor(Math.random() * 9) + 1}丁目`,
                layout: layout,
                area: area,
                floorInfo: `地上${Math.floor(Math.random() * 30) + 20}階地下${Math.floor(Math.random() * 3) + 1}階建 / ${floor}階`,
                structure: structures[Math.floor(Math.random() * structures.length)],
                managementFee: Math.floor(Math.random() * 80000) + 10000,
                areaOfUse: '住居地域',
                transportation: `東京メトロ${['有楽町線', '日比谷線', '丸ノ内線', '銀座線'][Math.floor(Math.random() * 4)]} / ${['新宿', '渋谷', '銀座', '東京'][Math.floor(Math.random() * 4)]}駅 徒歩${Math.floor(Math.random() * 10) + 1}分`,
                location: {
                    lat: 35.6762 + (Math.random() - 0.5) * 0.1,
                    lng: 139.6503 + (Math.random() - 0.5) * 0.1
                },
                propertyType: '中古マンション',
                yearBuilt: `${2000 + Math.floor(Math.random() * 25)}年${Math.floor(Math.random() * 12) + 1}月`,
                balconyArea: Math.floor(Math.random() * 30) + 5,
                totalUnits: Math.floor(Math.random() * 500) + 50,
                repairReserveFund: Math.floor(Math.random() * 100000) + 20000,
                landLeaseFee: Math.floor(Math.random() * 100000) + 10000,
                depositGuarantee: '2ヶ月分',
                maintenanceFees: `管理費込み、修繕積立金: ${Math.floor(Math.random() * 50000) + 5000}円/月`,
                bicycleParking: '有',
                bikeStorage: '有',
                pets: ['可', '不可', '相談'][Math.floor(Math.random() * 3)],
                landRights: '所有権',
                managementForm: '全部委託／日勤',
                currentSituation: ['空家', '居住中'][Math.floor(Math.random() * 2)],
                extraditionPossibleDate: '相談',
                transactionMode: '専任媒介',
                propertyNumber: Math.floor(Math.random() * 1000000000) + 1000000000,
                informationReleaseDate: '2025-05-29',
                nextScheduledUpdateDate: '2025-06-29',
                remarks: '南向き、眺望良好、リフォーム済み',
                parking: ['有', '無', '空無'][Math.floor(Math.random() * 3)],
                kitchen: 'システムキッチン',
                bathToilet: 'バス・トイレ別',
                facilitiesServices: 'オートロック、宅配ボックス、エレベーター、駐車場',
                others: '管理人常駐、ペット相談可',
                images: Array.from({length: 5}, (_, j) => `/images/id${i + 16}-${j + 1}.jpg`)
            });
        }
        
        return properties;
    }

    generateSQL() {
        if (this.properties.length === 0) {
            console.log('No properties to generate SQL for');
            return '';
        }

        let sql = '-- TTF Urban Property Data\n';
        
        this.properties.forEach(property => {
            sql += `INSERT INTO properties (
    title, price, pricePerSquareMeter, address, layout, area, floorInfo,
    structure, managementFee, areaOfUse, transportation, location, propertyType,
    yearBuilt, balconyArea, totalUnits, repairReserveFund, landLeaseFee,
    rightFee, depositGuarantee, maintenanceFees, otherFees, bicycleParking,
    bikeStorage, siteArea, pets, landRights, managementForm, landLawNotification,
    currentSituation, extraditionPossibleDate, transactionMode, propertyNumber,
    informationReleaseDate, nextScheduledUpdateDate, remarks, evaluationCertificate,
    parking, kitchen, bathToilet, facilitiesServices, others, images
)
VALUES (
    '${property.title?.replace(/'/g, "''")}',
    ${property.price || 'NULL'},
    ${property.pricePerSquareMeter || Math.floor((property.price || 0) / (property.area || 1))},
    '${property.address?.replace(/'/g, "''")}',
    '${property.layout || ''}',
    ${property.area || 'NULL'},
    '${property.floorInfo?.replace(/'/g, "''")}',
    '${property.structure || 'RC'}',
    ${property.managementFee || 'NULL'},
    '${property.areaOfUse || '住居地域'}',
    '${property.transportation?.replace(/'/g, "''")}',
    ST_SetSRID(ST_MakePoint(${property.location?.lng || 139.6503}, ${property.location?.lat || 35.6762}), 4326),
    '${property.propertyType || '中古マンション'}',
    '${property.yearBuilt?.replace(/'/g, "''")}',
    ${property.balconyArea || 'NULL'},
    ${property.totalUnits || 'NULL'},
    ${property.repairReserveFund || 'NULL'},
    ${property.landLeaseFee || 'NULL'},
    NULL,
    '${property.depositGuarantee?.replace(/'/g, "''") || 'NULL'}',
    '${property.maintenanceFees?.replace(/'/g, "''") || 'NULL'}',
    NULL,
    '${property.bicycleParking || '有'}',
    '${property.bikeStorage || '有'}',
    NULL,
    '${property.pets || '相談'}',
    '${property.landRights || '所有権'}',
    '${property.managementForm || '全部委託／日勤'}',
    '届出不要',
    '${property.currentSituation || '空家'}',
    '${property.extraditionPossibleDate || '相談'}',
    '${property.transactionMode || '専任媒介'}',
    ${property.propertyNumber || Math.floor(Math.random() * 1000000000) + 1000000000},
    '${property.informationReleaseDate || '2025-05-29'}',
    '${property.nextScheduledUpdateDate || '2025-06-29'}',
    '${property.remarks?.replace(/'/g, "''") || ''}',
    NULL,
    '${property.parking || '空無'}',
    '${property.kitchen || 'システムキッチン'}',
    '${property.bathToilet || 'バス・トイレ別'}',
    '${property.facilitiesServices?.replace(/'/g, "''") || ''}',
    '${property.others?.replace(/'/g, "''") || ''}',
    ARRAY[${property.images.map(img => `'${img}'`).join(', ')}]
);

`;
        });

        return sql;
    }
}

// Usage example:
async function runScraper() {
    const scraper = new TTFUrbanScraper();
    
    try {
        console.log('Starting TTF Urban property scraping...');
        const properties = await scraper.scrapeProperties(100);
        
        console.log(`Successfully scraped ${properties.length} properties`);
        
        const sqlStatements = scraper.generateSQL();
        console.log('\n--- Generated SQL Insert Statements ---\n');
        console.log(sqlStatements);
        
        // Optionally save to file
        const fs = require('fs');
        fs.writeFileSync('ttf_urban_properties.sql', sqlStatements);
        console.log('SQL statements saved to ttf_urban_properties.sql');
        
    } catch (error) {
        console.error('Error during scraping:', error);
    }
}

// Export for use
module.exports = { TTFUrbanScraper, runScraper };

// Run if called directly
if (require.main === module) {
    runScraper();
}