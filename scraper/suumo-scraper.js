/**
 * SUUMO Property Scraper
 * 
 * This script scrapes property listings from SUUMO (suumo.jp),
 * one of Japan's largest real estate websites.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  baseUrl: 'https://suumo.jp',
  searchParams: {
    type: 'buy', // 'buy' or 'rent'
    propertyType: 'mansion', // 'mansion', 'house', 'land', 'business'
    location: '東京都', // Prefecture in Japanese
    minPrice: 50000000, // Minimum price in JPY (optional)
    maxPrice: 100000000, // Maximum price in JPY (optional)
    minRooms: null, // Minimum number of rooms (optional)
    minArea: null, // Minimum floor area in m² (optional)
    maxDistanceFromStation: null // Maximum minutes from station (optional)
  },
  scraping: {
    maxPages: 10, // Maximum number of pages to scrape
    timeout: 30000, // Navigation timeout in milliseconds
    outputPath: './suumo_output', // Output directory
    takeScreenshots: true // Take screenshots during scraping for debugging
  }
};

/**
 * Main scraper function
 */
async function scrapeProperties() {
  console.log('Starting SUUMO property scraper...');
  console.log(`Looking for ${config.searchParams.type === 'buy' ? 'properties for sale' : 'rental properties'} in ${config.searchParams.location}`);
  
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Create output directory
    await fs.mkdir(config.scraping.outputPath, { recursive: true });
    
    // Initialize page
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    page.setDefaultNavigationTimeout(config.scraping.timeout);
    
    // Set Japanese language and region
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'ja-JP,ja;q=0.9'
    });
    
    // Navigate to the homepage
    await page.goto(config.baseUrl, { waitUntil: 'networkidle2' });
    console.log('Successfully loaded the homepage');
    
    if (config.scraping.takeScreenshots) {
      await page.screenshot({ path: path.join(config.scraping.outputPath, 'homepage.png') });
    }
    
    // Step 1: Navigate to the correct search section (buy or rent)
    if (config.searchParams.type === 'buy') {
      // For buying properties
      console.log('Navigating to buy section...');
      
      // First try clicking the buy navigation link
      try {
        // Look for buy section links - common patterns in Japanese real estate sites
        const buyLinkSelectors = [
          'a[href*="buy"]', 
          'a[href*="baikyaku"]', 
          'a[href*="baibai"]',
          'a[href*="purchase"]',
          'a[href*="mansiondata"]', // SUUMO-specific section for buying apartments
          'a[href*="kodate"]' // For buying houses
        ];
        
        let clicked = false;
        for (const selector of buyLinkSelectors) {
          const links = await page.$$(selector);
          if (links.length > 0) {
            for (const link of links) {
              const linkText = await page.evaluate(el => el.textContent.trim(), link);
              const linkHref = await page.evaluate(el => el.href, link);
              
              // Check if the link text contains buy-related keywords in Japanese
              const buyKeywords = ['購入', '買う', '売買', '中古', '住宅', 'マンション', '一戸建て'];
              if (buyKeywords.some(keyword => linkText.includes(keyword))) {
                console.log(`Found buy section link: ${linkText} (${linkHref})`);
                await link.click();
                await page.waitForNavigation({ waitUntil: 'networkidle2' });
                clicked = true;
                break;
              }
            }
            if (clicked) break;
          }
        }
        
        // If no link was clicked, try a direct URL
        if (!clicked) {
          console.log('Could not find buy section link, trying direct URL...');
          // SUUMO-specific URLs for buying properties
          if (config.searchParams.propertyType === 'mansion') {
            await page.goto('https://suumo.jp/ms/shinchiku/');
          } else if (config.searchParams.propertyType === 'house') {
            await page.goto('https://suumo.jp/ikkodate/');
          } else {
            await page.goto('https://suumo.jp/baikyaku/');
          }
          
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
        }
      } catch (error) {
        console.error(`Error navigating to buy section: ${error.message}`);
        
        // Fallback to direct URL
        try {
          await page.goto('https://suumo.jp/jj/bukken/ichiran/JJ012FC002/?ar=030&bs=011');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
        } catch (fallbackError) {
          console.error(`Fallback navigation also failed: ${fallbackError.message}`);
        }
      }
    } else {
      // For rental properties
      console.log('Navigating to rent section...');
      
      try {
        // Look for rent section links
        const rentLinkSelectors = [
          'a[href*="chintai"]',
          'a[href*="rent"]',
          'a[href*="lease"]'
        ];
        
        let clicked = false;
        for (const selector of rentLinkSelectors) {
          const links = await page.$$(selector);
          if (links.length > 0) {
            for (const link of links) {
              const linkText = await page.evaluate(el => el.textContent.trim(), link);
              const linkHref = await page.evaluate(el => el.href, link);
              
              // Check if the link text contains rent-related keywords in Japanese
              const rentKeywords = ['賃貸', '借りる', 'チンタイ', 'アパート'];
              if (rentKeywords.some(keyword => linkText.includes(keyword))) {
                console.log(`Found rent section link: ${linkText} (${linkHref})`);
                await link.click();
                await page.waitForNavigation({ waitUntil: 'networkidle2' });
                clicked = true;
                break;
              }
            }
            if (clicked) break;
          }
        }
        
        // If no link was clicked, try a direct URL
        if (!clicked) {
          console.log('Could not find rent section link, trying direct URL...');
          await page.goto('https://suumo.jp/chintai/');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
        }
      } catch (error) {
        console.error(`Error navigating to rent section: ${error.message}`);
        
        // Fallback to direct URL
        try {
          await page.goto('https://suumo.jp/jj/chintai/ichiran/FR301FC001/');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
        } catch (fallbackError) {
          console.error(`Fallback navigation also failed: ${fallbackError.message}`);
        }
      }
    }
    
    // Take a screenshot of the search page
    if (config.scraping.takeScreenshots) {
      await page.screenshot({ path: path.join(config.scraping.outputPath, 'search_page.png') });
    }
    
    console.log('On search page:', await page.title());
    
    // Step 2: Fill out the search form
    console.log('Filling out search form...');
    
    // Select the location (prefecture)
    try {
      // Find prefecture selectors - typically checkboxes or radio buttons
      const prefectureSelectors = [
        `input[name*="prefecture"][value*="${config.searchParams.location}"]`,
        `input[type="checkbox"][data-label*="${config.searchParams.location}"]`,
        `label:has-text("${config.searchParams.location}")`,
        `select[name*="prefecture"] option[value*="${config.searchParams.location}"]`
      ];
      
      let locationSelected = false;
      for (const selector of prefectureSelectors) {
        try {
          const elements = await page.$$(selector);
          if (elements.length > 0) {
            await elements[0].click();
            console.log(`Selected location: ${config.searchParams.location}`);
            locationSelected = true;
            break;
          }
        } catch (selectorError) {
          // Continue to next selector
        }
      }
      
      if (!locationSelected) {
        // Try using a select dropdown if checkboxes were not found
        const prefectureSelects = await page.$$('select[name*="prefecture"], select[name*="area"], select[id*="prefecture"]');
        if (prefectureSelects.length > 0) {
          await page.select(
            'select[name*="prefecture"], select[name*="area"], select[id*="prefecture"]', 
            // Common values for Tokyo in Japanese property sites
            '13' // Tokyo is often code 13
          );
          console.log(`Selected location from dropdown: ${config.searchParams.location}`);
          locationSelected = true;
        }
      }
      
      if (!locationSelected) {
        console.log(`Could not select location: ${config.searchParams.location}`);
      }
    } catch (error) {
      console.error(`Error selecting location: ${error.message}`);
    }
    
    // Select property type (if available)
    try {
      const propertyTypeMap = {
        'mansion': ['マンション', 'mansion', 'apartment', 'condo'],
        'house': ['一戸建て', 'house', 'kodate', 'detached'],
        'land': ['土地', 'land', 'tochi', 'plot'],
        'business': ['事業用', 'business', 'commercial', 'shop']
      };
      
      const typeKeywords = propertyTypeMap[config.searchParams.propertyType] || [];
      
      let typeSelected = false;
      for (const keyword of typeKeywords) {
        const selectors = [
          `input[type="checkbox"][name*="type"][value*="${keyword}"]`,
          `input[type="radio"][name*="type"][value*="${keyword}"]`,
          `label:has-text("${keyword}")`,
          `input[data-label*="${keyword}"]`
        ];
        
        for (const selector of selectors) {
          try {
            const elements = await page.$$(selector);
            if (elements.length > 0) {
              await elements[0].click();
              console.log(`Selected property type: ${config.searchParams.propertyType} (${keyword})`);
              typeSelected = true;
              break;
            }
          } catch (selectorError) {
            // Continue to next selector
          }
        }
        
        if (typeSelected) break;
      }
      
      if (!typeSelected) {
        console.log(`Could not select property type: ${config.searchParams.propertyType}`);
      }
    } catch (error) {
      console.error(`Error selecting property type: ${error.message}`);
    }
    
    // Set price range (if specified)
    if (config.searchParams.minPrice || config.searchParams.maxPrice) {
      try {
        // Find min price inputs/selects
        if (config.searchParams.minPrice) {
          const minPriceSelectors = [
            'select[name*="price"][name*="from"], select[name*="price"][name*="min"]',
            'select[id*="price"][id*="from"], select[id*="price"][id*="min"]',
            'input[name*="price"][name*="from"], input[name*="price"][name*="min"]'
          ];
          
          let minPriceSet = false;
          for (const selector of minPriceSelectors) {
            try {
              const elements = await page.$$(selector);
              if (elements.length > 0 && elements[0].tagName === 'SELECT') {
                // Find closest option value
                const options = await page.evaluate(sel => {
                  const element = document.querySelector(sel);
                  return Array.from(element.options).map(opt => ({
                    value: opt.value,
                    text: opt.textContent
                  }));
                }, selector);
                
                // Find appropriate option
                let selectedValue = null;
                for (const option of options) {
                  // Extract numeric part of the option text
                  const match = option.text.match(/(\d+)/);
                  if (match) {
                    const optionValue = parseInt(match[1]);
                    if (optionValue >= config.searchParams.minPrice / 10000) { // Convert to 万円 (10,000 yen)
                      selectedValue = option.value;
                      break;
                    }
                  }
                }
                
                if (selectedValue) {
                  await page.select(selector, selectedValue);
                  console.log(`Set minimum price: ${selectedValue}`);
                  minPriceSet = true;
                  break;
                }
              } else if (elements.length > 0) {
                // It's an input field
                await elements[0].type(config.searchParams.minPrice.toString());
                console.log(`Set minimum price: ${config.searchParams.minPrice}`);
                minPriceSet = true;
                break;
              }
            } catch (selectorError) {
              // Continue to next selector
            }
          }
          
          if (!minPriceSet) {
            console.log(`Could not set minimum price: ${config.searchParams.minPrice}`);
          }
        }
        
        // Find max price inputs/selects
        if (config.searchParams.maxPrice) {
          const maxPriceSelectors = [
            'select[name*="price"][name*="to"], select[name*="price"][name*="max"]',
            'select[id*="price"][id*="to"], select[id*="price"][id*="max"]',
            'input[name*="price"][name*="to"], input[name*="price"][name*="max"]'
          ];
          
          let maxPriceSet = false;
          for (const selector of maxPriceSelectors) {
            try {
              const elements = await page.$$(selector);
              if (elements.length > 0 && elements[0].tagName === 'SELECT') {
                // Find closest option value
                const options = await page.evaluate(sel => {
                  const element = document.querySelector(sel);
                  return Array.from(element.options).map(opt => ({
                    value: opt.value,
                    text: opt.textContent
                  }));
                }, selector);
                
                // Find appropriate option
                let selectedValue = null;
                for (const option of options.reverse()) {
                  // Extract numeric part of the option text
                  const match = option.text.match(/(\d+)/);
                  if (match) {
                    const optionValue = parseInt(match[1]);
                    if (optionValue <= config.searchParams.maxPrice / 10000) { // Convert to 万円 (10,000 yen)
                      selectedValue = option.value;
                      break;
                    }
                  }
                }
                
                if (selectedValue) {
                  await page.select(selector, selectedValue);
                  console.log(`Set maximum price: ${selectedValue}`);
                  maxPriceSet = true;
                  break;
                }
              } else if (elements.length > 0) {
                // It's an input field
                await elements[0].type(config.searchParams.maxPrice.toString());
                console.log(`Set maximum price: ${config.searchParams.maxPrice}`);
                maxPriceSet = true;
                break;
              }
            } catch (selectorError) {
              // Continue to next selector
            }
          }
          
          if (!maxPriceSet) {
            console.log(`Could not set maximum price: ${config.searchParams.maxPrice}`);
          }
        }
      } catch (error) {
        console.error(`Error setting price range: ${error.message}`);
      }
    }
    
    // Take a screenshot after filling the form
    if (config.scraping.takeScreenshots) {
      await page.screenshot({ path: path.join(config.scraping.outputPath, 'filled_form.png') });
    }
    
    // Step 3: Submit the search form
    console.log('Submitting search form...');
    
    try {
      // Look for search/submit buttons
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button.search-button',
        'button:has-text("検索")', // "Search" in Japanese
        'input[name*="search"]',
        'button[class*="search"]'
      ];
      
      let submitted = false;
      for (const selector of submitSelectors) {
        try {
          const buttons = await page.$$(selector);
          if (buttons.length > 0) {
            console.log(`Found submit button: ${selector}`);
            await Promise.all([
              buttons[0].click(),
              page.waitForNavigation({ waitUntil: 'networkidle2' })
            ]);
            submitted = true;
            break;
          }
        } catch (selectorError) {
          // Continue to next selector
        }
      }
      
      if (!submitted) {
        // Try submitting the form directly
        console.log('Could not find submit button, trying to submit form directly...');
        submitted = await page.evaluate(() => {
          const form = document.querySelector('form');
          if (form) {
            form.submit();
            return true;
          }
          return false;
        });
        
        if (submitted) {
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
          console.log('Submitted form directly');
        } else {
          console.log('Could not submit form');
        }
      }
    } catch (error) {
      console.error(`Error submitting search form: ${error.message}`);
    }
    
    // Take a screenshot of the search results
    if (config.scraping.takeScreenshots) {
      await page.screenshot({ path: path.join(config.scraping.outputPath, 'search_results.png') });
    }
    
    // Step 4: Extract property listings
    console.log('Extracting property listings...');
    
    const allProperties = [];
    let currentPage = 1;
    
    while (currentPage <= config.scraping.maxPages) {
      console.log(`Scraping page ${currentPage}...`);
      
      // Wait for property listing elements to load
      try {
        // Common SUUMO listing selectors
        const listingSelectors = [
          '.property_unit', // Common SUUMO class for property units
          '.cassetteitem', // Another common SUUMO class
          'div[data-bukken-id]', // Properties with bukken ID
          '.property-item',
          '.bukken_item',
          '.bukken-cassette',
          '.bukken-box',
          '.l-cassette',
          '.mod-propertyCard'
        ];
        
        let listingsFound = false;
        let usedSelector = '';
        
        for (const selector of listingSelectors) {
          try {
            const count = await page.evaluate((sel) => {
              return document.querySelectorAll(sel).length;
            }, selector);
            
            if (count > 0) {
              console.log(`Found ${count} listings with selector: ${selector}`);
              listingsFound = true;
              usedSelector = selector;
              break;
            }
          } catch (selectorError) {
            // Continue to next selector
          }
        }
        
        if (!listingsFound) {
          console.log('Could not find property listings with any selector');
          break;
        }
        
        // Extract property information
        const properties = await page.evaluate((selector) => {
          const items = document.querySelectorAll(selector);
          
          return Array.from(items).map(item => {
            // Helper function to safely extract text content
            const extractText = (parentElement, selector, fallbackValue = 'N/A') => {
              const element = parentElement.querySelector(selector);
              return element ? element.textContent.trim() : fallbackValue;
            };
            
            // Helper function to find an image URL
            const extractImageUrl = (parentElement) => {
              const img = parentElement.querySelector('img');
              return img ? (img.src || img.getAttribute('data-src') || 'N/A') : 'N/A';
            };
            
            // Helper function to find a link URL
            const extractLink = (parentElement) => {
              const link = parentElement.querySelector('a[href*="detail"]') || 
                           parentElement.querySelector('a[href*="casedetail"]') || 
                           parentElement.querySelector('a');
              return link ? link.href : 'N/A';
            };
            
            // Extract common property details
            const title = extractText(item, '.property_unit-title, .cassetteitem_content-title, .property-title, .bukken-name, h2, h3, [class*="title"]');
            
            // For price, look for specific price elements or any element containing yen symbol
            const priceElements = Array.from(item.querySelectorAll('[class*="price"], [class*="money"], [class*="value"]'));
            const priceElement = priceElements.find(el => el.textContent.includes('円') || el.textContent.includes('万')) || priceElements[0];
            const price = priceElement ? priceElement.textContent.trim() : extractText(item, '.price, .detail_price');
            
            // For address, look for specific address elements
            const address = extractText(item, '[class*="address"], [class*="location"], .cassetteitem_detail-col1');
            
            // For other common details
            const sqm = extractText(item, '[class*="area"], [class*="menseki"], .cassetteitem_menseki');
            const rooms = extractText(item, '[class*="madori"], [class*="layout"], .cassetteitem_madori');
            const age = extractText(item, '[class*="age"], [class*="year"], [class*="built"], .cassetteitem_age');
            const station = extractText(item, '[class*="station"], [class*="access"], .cassetteitem_access');
            
            // Additional details that might be available
            const description = extractText(item, '[class*="comment"], [class*="description"], [class*="appeal"], p');
            const imageUrl = extractImageUrl(item);
            const detailUrl = extractLink(item);
            
            return {
              title: title !== 'N/A' ? title : `Property in ${address}`,
              price,
              address,
              sqm,
              rooms,
              age,
              station,
              description,
              imageUrl,
              detailUrl
            };
          });
        }, usedSelector);
        
        console.log(`Extracted ${properties.length} properties from page ${currentPage}`);
        allProperties.push(...properties);
        
        // Check if there's a next page
        const hasNextPage = await page.evaluate(() => {
          // Look for pagination elements with "次へ" (next) text or common next page indicators
          const nextButtons = Array.from(document.querySelectorAll('.pagination .next, [class*="pagination"] .next, a.next, [class*="next"], a[rel="next"]'));
          
          return nextButtons.some(btn => 
            !btn.classList.contains('disabled') && 
            !btn.hasAttribute('disabled')
          );
        });
        
        if (!hasNextPage || currentPage >= config.scraping.maxPages) {
          console.log('No more pages or reached maximum page limit');
          break;
        }
        
        // Navigate to the next page
        console.log('Navigating to next page...');
        try {
          await Promise.all([
            page.click('.pagination .next, [class*="pagination"] .next, a.next, [class*="next"], a[rel="next"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
          ]);
          
          currentPage++;
          
          // Take a screenshot of the new page
          if (config.scraping.takeScreenshots) {
            await page.screenshot({ path: path.join(config.scraping.outputPath, `page_${currentPage}.png`) });
          }
        } catch (error) {
          console.error(`Error navigating to next page: ${error.message}`);
          break;
        }
      } catch (error) {
        console.error(`Error extracting listings: ${error.message}`);
        break;
      }
    }
    
    // Save the extracted properties
    console.log(`Total properties scraped: ${allProperties.length}`);
    
    if (allProperties.length > 0) {
      // Generate timestamp for filenames
      const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
      
      // Save as JSON
      const jsonOutputPath = path.join(config.scraping.outputPath, `suumo_properties_${timestamp}.json`);
      await fs.writeFile(jsonOutputPath, JSON.stringify(allProperties, null, 2), 'utf8');
      console.log(`Data saved as JSON: ${jsonOutputPath}`);
      
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
      
      const csvOutputPath = path.join(config.scraping.outputPath, `suumo_properties_${timestamp}.csv`);
      await fs.writeFile(csvOutputPath, csvRows.join('\n'), 'utf8');
      console.log(`Data saved as CSV: ${csvOutputPath}`);
    } else {
      console.log('No properties were found to save');
    }
    
  } catch (error) {
    console.error(`An error occurred during scraping: ${error.message}`);
  } finally {
    await browser.close();
    console.log('Browser closed. Scraping completed.');
  }
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