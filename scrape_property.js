const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function scrapeProperty(url, name) {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Adjust if Chrome is elsewhere
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    dumpio: true
  }).catch(err => {
    console.error(`Browser launch failed: ${err.message}`);
    throw err;
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  try {
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for the property details section
    await page.waitForSelector('.property-detail-infos', { timeout: 10000 }).catch(() => {
      console.warn('Property details section not found, attempting to scrape anyway...');
    });

    // Extract property details
    const propertyData = await page.evaluate(() => {
      const data = {};

      // Helper to get text from selector within .property-detail-infos
      const getText = (selector, parent = '.property-detail-infos') => {
        const element = document.querySelector(`${parent} ${selector}`);
        return element ? element.textContent.trim() : null;
      };

      // Helper to find text by label
      const getTextByLabel = (label) => {
        const labelElement = Array.from(document.querySelectorAll('.property-detail-infos dt, .property-detail-infos .label, .property-detail-infos span'))
          .find(el => el.textContent.includes(label));
        if (labelElement) {
          const sibling = labelElement.nextElementSibling || labelElement.parentElement.querySelector('dd, .value');
          return sibling ? sibling.textContent.trim() : null;
        }
        return null;
      };

      // Map fields
      data.title = getText('h1') || getText('.property-title') || 'Unknown Property';
      data.price = getTextByLabel('価格') || getText('.price') || null;
      data.address = getTextByLabel('所在地') || getText('.address') || null;
      data.layout = getTextByLabel('間取り') || getText('.layout') || null;
      data.area = getTextByLabel('専有面積') || getText('.area') || null;
      data.floorInfo = getTextByLabel('階建') || getText('.floor-info') || null;
      data.structure = getTextByLabel('構造') || getText('.structure') || null;
      data.managementFee = getTextByLabel('管理費') || getText('.management-fee') || null;
      data.areaOfUse = getTextByLabel('用途地域') || getText('.area-of-use') || null;
      data.transportation = getTextByLabel('交通') || getText('.transportation') || null;
      data.yearBuilt = getTextByLabel('築年月') || getText('.year-built') || null;
      data.balconyArea = getTextByLabel('バルコニー面積') || getText('.balcony-area') || null;
      data.totalUnits = getTextByLabel('総戸数') || getText('.total-units') || null;
      data.repairReserveFund = getTextByLabel('修繕積立金') || getText('.repair-reserve-fund') || null;
      data.landRights = getTextByLabel('土地権利') || getText('.land-rights') || null;
      data.managementForm = getTextByLabel('管理形態') || getText('.management-form') || null;
      data.currentSituation = getTextByLabel('現況') || getText('.current-situation') || null;
      data.extraditionPossibleDate = getTextByLabel('引渡し') || getText('.extradition-date') || null;
      data.transactionMode = getTextByLabel('取引態様') || getText('.transaction-mode') || null;
      data.propertyNumber = getTextByLabel('物件番号') || getText('.property-number') || null;
      data.informationReleaseDate = getTextByLabel('情報公開日') || '2025-06-16'; // Updated to current date
      data.nextScheduledUpdateDate = getTextByLabel('次回更新予定日') || '2025-06-30'; // Updated to +14 days
      data.remarks = getTextByLabel('備考') || getText('.remarks') || null;
      data.parking = getTextByLabel('駐車場') || getText('.parking') || null;
      data.kitchen = getTextByLabel('キッチン') || getText('.kitchen') || null;
      data.bathToilet = getTextByLabel('バス・トイレ') || getText('.bath-toilet') || null;
      data.facilitiesServices = getTextByLabel('設備・サービス') || getText('.facilities-services') || null;
      data.others = getTextByLabel('その他') || getText('.others') || null;

      return data;
    });

    console.log('Extracted property data:', propertyData);

    // Clean and process data
    const cleanPrice = (price) => {
      if (!price) return null;
      const cleaned = price.replace(/[^0-9]/g, '');
      return parseInt(cleaned, 10) || null;
    };

    const cleanArea = (area) => {
      if (!area) return null;
      const cleaned = area.replace(/[^0-9.]/g, '');
      return parseFloat(cleaned) || null;
    };

    // Parse address for zipcode and hierarchical areas
    let zipcode = null;
    let area_level_1 = '首都圏';
    let area_level_2 = null;
    let area_level_3 = null;
    let area_level_4 = null;

    if (propertyData.address) {
      const zipMatch = propertyData.address.match(/〒?(\d{3}-\d{4})/);
      zipcode = zipMatch ? zipMatch[1] : null;

      const addressParts = propertyData.address.replace(/〒\d{3}-\d{4}/, '').trim().split(/県|市|区/);
      area_level_2 = addressParts[0] ? `${addressParts[0]}県` : null;
      area_level_3 = addressParts[1] ? `${addressParts[1]}市` : null;
      area_level_4 = addressParts[2] ? addressParts[2] : null;
    }

    // Generate images array
    const images = Array.from({ length: 5 }, (_, i) => `/images/${name}-${i + 1}.jpg`);

    // Construct SQL
    const sql = `
INSERT INTO properties (
    title, price, pricePerSquareMeter, address, layout, area, floorInfo,
    structure, managementFee, areaOfUse, transportation, location, propertyType,
    yearBuilt, balconyArea, totalUnits, repairReserveFund, landLeaseFee,
    rightFee, depositGuarantee, maintenanceFees, otherFees, bicycleParking,
    bikeStorage, siteArea, pets, landRights, managementForm, landLawNotification,
    currentSituation, extraditionPossibleDate, transactionMode, propertyNumber,
    informationReleaseDate, nextScheduledUpdateDate, remarks, evaluationCertificate,
    parking, kitchen, bathToilet, facilitiesServices, others, images,
    zipcode, area_level_1, area_level_2, area_level_3, area_level_4, status
)
VALUES (
    '${propertyData.title || 'Unknown Property'}',
    ${cleanPrice(propertyData.price) || 'NULL'},
    ${propertyData.area ? Math.round((cleanPrice(propertyData.price) || 0) / cleanArea(propertyData.area)) : 'NULL'},
    '${propertyData.address || 'NULL'}',
    '${propertyData.layout || 'NULL'}',
    ${cleanArea(propertyData.area) || 'NULL'},
    '${propertyData.floorInfo || 'NULL'}',
    '${propertyData.structure || 'NULL'}',
    ${cleanPrice(propertyData.managementFee) || 'NULL'},
    '${propertyData.areaOfUse || 'NULL'}',
    '${propertyData.transportation || 'NULL'}',
    ${'NULL' /* Placeholder for ST_SetSRID(ST_MakePoint(...), 4326) */},
    '中古マンション',
    '${propertyData.yearBuilt || 'NULL'}',
    ${cleanArea(propertyData.balconyArea) || 'NULL'},
    ${parseInt(propertyData.totalUnits, 10) || 'NULL'},
    ${cleanPrice(propertyData.repairReserveFund) || 'NULL'},
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '${propertyData.parking ? '有' : 'NULL'}',
    '${propertyData.parking ? '有' : 'NULL'}',
    NULL,
    NULL,
    '${propertyData.landRights || '所有権'}',
    '${propertyData.managementForm || '日勤'}',
    '届出不要',
    '${propertyData.currentSituation || '空家'}',
    '${propertyData.extraditionPossibleDate || '相談'}',
    '${propertyData.transactionMode || '仲介'}',
    ${propertyData.propertyNumber || 'NULL'},
    '${propertyData.informationReleaseDate}',
    '${propertyData.nextScheduledUpdateDate}',
    '${propertyData.remarks || 'NULL'}',
    NULL,
    '${propertyData.parking || 'NULL'}',
    '${propertyData.kitchen || 'NULL'}',
    '${propertyData.bathToilet || 'NULL'}',
    '${propertyData.facilitiesServices || 'NULL'}',
    '${propertyData.others || 'NULL'}',
    ARRAY['${images.join("','")}'],
    '${zipcode || 'NULL'}',
    '${area_level_1}',
    '${area_level_2 || 'NULL'}',
    '${area_level_3 || 'NULL'}',
    '${area_level_4 || 'NULL'}',
    'for sale'
);
`;

    await browser.close();
    return sql;
  } catch (err) {
    console.error(`Error during scraping: ${err.message}`);
    await browser.close();
    return null;
  }
}

// Main execution
(async () => {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.error('Usage: node scrape_property.js <url> <name>');
    process.exit(1);
  }

  const [url, name] = args;
  console.log(`Starting scrape for URL: ${url}, Name: ${name}`);
  const sql = await scrapeProperty(url, name);
  if (sql) {
    console.log('Generated SQL:');
    console.log(sql);
    await fs.writeFile('property.sql', sql);
    console.log('SQL saved to property.sql');
  } else {
    console.error('Failed to generate SQL');
  }
})();

// node scrape_property.js https://www.rehouse.co.jp/buy/mansion/bkdetail/F84AFA0B/ id75