/**
 * Japanese Real Estate Direct Access Scraper
 * 
 * This script attempts to scrape real estate listings from multiple Japanese
 * websites using direct access URLs and anti-detection measures.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  // Search parameters
  search: {
    type: 'buy', // 'buy' or 'rent'
    propertyType: 'mansion', // 'mansion', 'house', 'land', 'business'
    location: '東京都', // Prefecture in Japanese
    minPrice: 50000000, // Minimum price in JPY
    maxPrice: 100000000, // Maximum price in JPY
  },
  // Sites to try
  sites: [
    {
      name: 'SUUMO',
      baseUrl: 'https://suumo.jp',
      // Direct search URLs for different property types and actions
      directUrls: {
        buy: {
          mansion: 'https://suumo.jp/jj/bukken/ichiran/JJ010FJ001/?ar=030&bs=011&ta=13', // Tokyo mansion
          house: 'https://suumo.jp/jj/bukken/ichiran/JJ010FJ001/?ar=030&bs=021&ta=13', // Tokyo house
          land: 'https://suumo.jp/jj/bukken/ichiran/JJ010FJ001/?ar=030&bs=030&ta=13', // Tokyo land
          business: 'https://suumo.jp/jj/bukken/ichiran/JJ010FJ001/?ar=030&bs=050&ta=13' // Tokyo business
        },
        rent: {
          mansion: 'https://suumo.jp/jj/chintai/ichiran/FR301FC001/?ar=030&bs=040&ta=13', // Tokyo apartment
          house: 'https://suumo.jp/jj/chintai/ichiran/FR301FC001/?ar=030&bs=050&ta=13', // Tokyo house
          land: 'https://suumo.jp/jj/chintai/ichiran/FR301FC001/?ar=030&bs=020&ta=13', // Tokyo land
          business: 'https://suumo.jp/jj/chintai/ichiran/FR301FC001/?ar=030&bs=010&ta=13' // Tokyo business
        }
      },
      // Selectors for property listings
      selectors: {
        listings: '.property_unit, .cassetteitem, article, [data-bukken-id], .l-cassetteitem',
        title: '.property_unit-title, .cassetteitem_content-title, h2, h3, [class*="title"]',
        price: '[class*="price"], [class*="money"], [class*="value"]',
        address: '[class*="address"], [class*="location"], .cassetteitem_detail-col1',
        sqm: '[class*="area"], [class*="menseki"], .cassetteitem_menseki',
        rooms: '[class*="madori"], [class*="layout"], .cassetteitem_madori',
        age: '[class*="age"], [class*="year"], [class*="built"]',
        station: '[class*="station"], [class*="access"]',
        image: 'img',
        link: 'a[href*="detail"], a[href*="casedetail"], a'
      }
    },
    {
      name: 'AtHome',
      baseUrl: 'https://www.athome.co.jp',
      directUrls: {
        buy: {
          mansion: 'https://www.athome.co.jp/mansion/chuko/tokyo/list/', // Tokyo used mansion
          house: 'https://www.athome.co.jp/kodate/chuko/tokyo/list/', // Tokyo used house
          land: 'https://www.athome.co.jp/tochi/tokyo/list/', // Tokyo land
          business: 'https://www.athome.co.jp/tochi/jigyou/tokyo/list/' // Tokyo business land
        },
        rent: {
          mansion: 'https://www.athome.co.jp/chintai/tokyo/list/', // Tokyo apartment
          house: 'https://www.athome.co.jp/chintai/ikkodate/tokyo/list/', // Tokyo house
          land: 'https://www.athome.co.jp/chintai-tochi/tokyo/list/', // Tokyo land
          business: 'https://www.athome.co.jp/chintai-office/tokyo/list/' // Tokyo business
        }
      },
      selectors: {
        listings: '.object, .p-property-object, article[data-cassetteitem], .cassette, .item',
        title: '.object-title, .p-property-object__title, h2, h3',
        price: '.object-price, [class*="price"], [data-item="price"]',
        address: '.object-address, [class*="address"], [data-item="address"]',
        sqm: '.object-data dt:contains("面積") + dd, [data-item="area"]',
        rooms: '.object-data dt:contains("間取") + dd, [data-item="madori"]',
        age: '.object-data dt:contains("築年") + dd, [data-item="age"]',
        station: '.object-data dt:contains("交通") + dd, [data-item="access"]',
        image: 'img.object-thumb, img.p-property-object__thumbnail',
        link: 'a.object-link, a.p-property-object__link, a[href*="detail"]'
      }
    },
    {
      name: 'Homes',
      baseUrl: 'https://www.homes.co.jp',
      directUrls: {
        buy: {
          mansion: 'https://www.homes.co.jp/mansion/chuko/tokyo/list/', // Tokyo used mansion
          house: 'https://www.homes.co.jp/kodate/tokyo/list/', // Tokyo house
          land: 'https://www.homes.co.jp/tochi/tokyo/list/', // Tokyo land
          business: 'https://www.homes.co.jp/tenpo-office/tokyo/list/' // Tokyo business
        },
        rent: {
          mansion: 'https://www.homes.co.jp/chintai/tokyo/list/', // Tokyo apartment
          house: 'https://www.homes.co.jp/chintai/ikkodate/tokyo/list/', // Tokyo house
          land: 'https://www.homes.co.jp/chintai-tochi/tokyo/list/', // Tokyo land
          business: 'https://www.homes.co.jp/chintai-office/tokyo/list/' // Tokyo business
        }
      },
      selectors: {
        listings: '.mod-mergeBuilding, article, .building-box, .c-building-cassette, .p-property',
        title: '.mod-building-name, h2, h3, .building-name, [class*="title"]',
        price: '.price, [class*="price"], [data-label="price"]',
        address: '.address, [class*="address"], [data-label="address"]',
        sqm: '.floor-space, [data-label="area"]',
        rooms: '.floor-plan, [data-label="madori"]',
        age: '.age, [data-label="age"]',
        station: '.access, [data-label="access"]',
        image: 'img.building-image, img.photo',
        link: 'a.building-link, a[href*="detail"]'
      }
    }
  ],
  // Browser settings
  browser: {
    headless: "new",
    timeout: 30000,
    userAgents: [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 Edg/92.0.902.84',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0'
    ]
  },
  // Output settings
  output: {
    path: './property_results',
    takeScreenshots: true
  }
};

/**
 * Delay helper function
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Scrapes properties from multiple Japanese real estate websites
 */
async function scrapeProperties() {
  console.log('Starting Japanese Real Estate Scraper...');
  console.log(`Looking for ${config.search.type === 'buy' ? 'properties for sale' : 'rental properties'} in ${config.search.location}`);
  
  // Create output directory
  await fs.mkdir(config.output.path, { recursive: true }).catch(() => {});
  
  // Launch browser with stealth mode
  const browser = await puppeteer.launch({
    headless: config.browser.headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--lang=ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7'
    ],
    ignoreHTTPSErrors: true
  });
  
  // Array to store all properties from all sites
  const allProperties = [];
  
  // Track successful sites
  const siteResults = [];
  
  // Try each site in order
  for (const site of config.sites) {
    console.log(`\nTrying site: ${site.name}`);
    
    try {
      // Get new page
      const page = await browser.newPage();
      
      // Set timeout
      page.setDefaultNavigationTimeout(config.browser.timeout);
      
      // Set viewport
      await page.setViewport({ width: 1366, height: 768 });
      
      // Set random user agent
      const randomUserAgent = config.browser.userAgents[Math.floor(Math.random() * config.browser.userAgents.length)];
      await page.setUserAgent(randomUserAgent);
      
      // Set extra headers to appear more like a real browser
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1'
      });
      
      // Attempt to mimic human behavior
      await page.evaluateOnNewDocument(() => {
        // Overwrite the 'navigator' property to use a Chrome-like navigator
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false
        });
        
        // Add language settings
        Object.defineProperty(navigator, 'languages', {
          get: () => ['ja-JP', 'ja', 'en-US', 'en']
        });
        
        // Add plugins array
        Object.defineProperty(navigator, 'plugins', {
          get: () => [
            {
              0: {
                type: "application/pdf",
                suffixes: "pdf",
                description: "Portable Document Format"
              },
              description: "Chrome PDF Plugin"
            }
          ]
        });
      });
      
      // Get direct URL for the specified search
      const directUrl = site.directUrls[config.search.type][config.search.propertyType];
      console.log(`Navigating to: ${directUrl}`);
      
      try {
        // Go to the direct search URL
        await page.goto(directUrl, { waitUntil: 'networkidle2' });
        
        // Take screenshot of search page
        if (config.output.takeScreenshots) {
          await page.screenshot({ 
            path: path.join(config.output.path, `${site.name}_search_page.png`),
            fullPage: true
          });
        }
        
        // Check for CAPTCHA or robot detection
        const isCaptchaPresent = await page.evaluate(() => {
          return (
            document.body.innerText.includes('CAPTCHA') ||
            document.body.innerText.includes('ロボット') || // "Robot" in Japanese
            document.body.innerText.includes('認証') || // "Authentication" in Japanese
            document.body.innerText.includes('確認') || // "Verification" in Japanese
            document.body.innerText.includes('セキュリティ') || // "Security" in Japanese
            document.body.innerText.includes('not a robot') ||
            document.body.innerText.includes('アクセスが一時的にブロック') || // "Access temporarily blocked" in Japanese
            document.body.innerText.includes('automated access')
          );
        });
        
        if (isCaptchaPresent) {
          console.log(`Detected CAPTCHA or robot check on ${site.name}. Skipping this site.`);
          await page.close();
          continue;
        }
        
        // Wait briefly to simulate human behavior
        await delay(Math.random() * 3000 + 2000);
        
        // Extract properties
        console.log(`Extracting properties from ${site.name}...`);
        
        const properties = await page.evaluate((selectors) => {
          // Find all property listings
          const listingElements = document.querySelectorAll(selectors.listings);
          console.log(`Found ${listingElements.length} listing elements on the page`);
          
          if (listingElements.length === 0) {
            // If no property listings found with the primary selector, try to find any potential listing containers
            const potentialContainers = Array.from(document.querySelectorAll('div, article, section'))
              .filter(el => (
                // Filter for elements that likely contain property listings
                (el.querySelectorAll('a, img').length > 2) && // Has links and images
                (el.querySelectorAll('*').length > 10) && // Has a reasonable number of child elements
                (el.textContent.includes('円') || el.textContent.includes('万')) && // Contains price indicators (yen)
                (el.offsetHeight > 100) // Has visible height
              ));
            
            console.log(`Found ${potentialContainers.length} potential property containers`);
            
            // If potential containers found, use those instead
            if (potentialContainers.length > 0) {
              return Array.from(potentialContainers).map(el => extractPropertyData(el, selectors));
            }
            
            return [];
          }
          
          // Extract data from each listing
          return Array.from(listingElements).map(el => extractPropertyData(el, selectors));
          
          // Helper function to extract property data
          function extractPropertyData(element, selectors) {
            // Helper function to safely get text content
            const getText = (parentEl, selector) => {
              const el = parentEl.querySelector(selector);
              return el ? el.textContent.trim() : 'N/A';
            };
            
            // Helper function to get image URL
            const getImageUrl = (parentEl, selector) => {
              const img = parentEl.querySelector(selector);
              return img ? (img.src || img.getAttribute('data-src') || 'N/A') : 'N/A';
            };
            
            // Helper function to get link URL
            const getLinkUrl = (parentEl, selector) => {
              const link = parentEl.querySelector(selector);
              return link ? link.href : 'N/A';
            };
            
            // Extract property details
            const title = getText(element, selectors.title);
            const price = getText(element, selectors.price);
            const address = getText(element, selectors.address);
            const sqm = getText(element, selectors.sqm);
            const rooms = getText(element, selectors.rooms);
            const age = getText(element, selectors.age);
            const station = getText(element, selectors.station);
            const imageUrl = getImageUrl(element, selectors.image);
            const detailUrl = getLinkUrl(element, selectors.link);
            
            // Check if we have enough meaningful data
            const isValidListing = (
              (title !== 'N/A' || address !== 'N/A') && 
              (price !== 'N/A' || detailUrl !== 'N/A')
            );
            
            if (!isValidListing) {
              return null;
            }
            
            return {
              title: title !== 'N/A' ? title : `Property in ${address}`,
              price,
              address,
              sqm,
              rooms,
              age,
              station,
              imageUrl,
              detailUrl,
              source: window.location.hostname
            };
          }
        }, site.selectors);
        
        // Filter out null values
        const validProperties = properties.filter(p => p !== null);
        
        console.log(`Extracted ${validProperties.length} properties from ${site.name}`);
        
        if (validProperties.length > 0) {
          allProperties.push(...validProperties);
          
          // Save properties from this site
          const siteFilename = `${site.name.toLowerCase()}_properties.json`;
          await fs.writeFile(
            path.join(config.output.path, siteFilename),
            JSON.stringify(validProperties, null, 2),
            'utf8'
          );
          
          siteResults.push({
            name: site.name,
            success: true,
            count: validProperties.length,
            filename: siteFilename
          });
        } else {
          console.log(`No valid properties found on ${site.name}`);
          
          // Take a screenshot of the page for debugging
          if (config.output.takeScreenshots) {
            await page.screenshot({ 
              path: path.join(config.output.path, `${site.name}_no_properties.png`),
              fullPage: true
            });
          }
          
          siteResults.push({
            name: site.name,
            success: false,
            count: 0,
            error: 'No valid properties found'
          });
        }
        
      } catch (error) {
        console.error(`Error accessing ${site.name}: ${error.message}`);
        
        // Take error screenshot
        if (config.output.takeScreenshots) {
          try {
            await page.screenshot({ 
              path: path.join(config.output.path, `${site.name}_error.png`),
              fullPage: true
            });
          } catch (screenshotError) {
            console.error(`Error taking screenshot: ${screenshotError.message}`);
          }
        }
        
        siteResults.push({
          name: site.name,
          success: false,
          count: 0,
          error: error.message
        });
      }
      
      // Close the page
      await page.close();
      
    } catch (siteError) {
      console.error(`Error with site ${site.name}: ${siteError.message}`);
      
      siteResults.push({
        name: site.name,
        success: false,
        count: 0,
        error: siteError.message
      });
    }
  }
  
  // Close the browser
  await browser.close();
  
  // Process and save final results
  if (allProperties.length > 0) {
    console.log(`\nTotal properties scraped: ${allProperties.length}`);
    
    // Generate timestamp for filenames
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    // Save all properties to a single file
    const jsonOutputPath = path.join(config.output.path, `all_properties_${timestamp}.json`);
    await fs.writeFile(jsonOutputPath, JSON.stringify(allProperties, null, 2), 'utf8');
    console.log(`All data saved as JSON: ${jsonOutputPath}`);
    
    // Save as CSV
    const csvRows = [
      // Header row
      Object.keys(allProperties[0]).join(','),
      // Data rows
      ...allProperties.map(property => 
        Object.values(property).map(value => 
          // Escape commas and quotes in CSV values
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      )
    ];
    
    const csvOutputPath = path.join(config.output.path, `all_properties_${timestamp}.csv`);
    await fs.writeFile(csvOutputPath, csvRows.join('\n'), 'utf8');
    console.log(`All data saved as CSV: ${csvOutputPath}`);
    
    // Save site results summary
    const summaryPath = path.join(config.output.path, `scraping_summary_${timestamp}.json`);
    await fs.writeFile(
      summaryPath, 
      JSON.stringify({
        timestamp: new Date().toISOString(),
        totalProperties: allProperties.length,
        searchParams: config.search,
        siteResults
      }, null, 2),
      'utf8'
    );
    console.log(`Scraping summary saved: ${summaryPath}`);
  } else {
    console.log('\nNo properties were found from any site.');
    
    // Save empty results summary
    const summaryPath = path.join(config.output.path, `scraping_summary_failed.json`);
    await fs.writeFile(
      summaryPath, 
      JSON.stringify({
        timestamp: new Date().toISOString(),
        totalProperties: 0,
        searchParams: config.search,
        siteResults,
        message: 'No properties were found from any site.'
      }, null, 2),
      'utf8'
    );
    console.log(`Failed scraping summary saved: ${summaryPath}`);
  }
  
  console.log('\nScraping completed.');
}

// Configuration helper function
function updateConfig(newConfig) {
  // Deep merge config objects
  const mergeObjects = (target, source) => {
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeObjects(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
    return target;
  };
  
  return mergeObjects(config, newConfig);
}

// Run the scraper with default configuration
scrapeProperties();

// Export functions for external use
module.exports = {
  scrapeProperties,
  updateConfig
};