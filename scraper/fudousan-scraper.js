/**
 * Property Scraper for fudousan.or.jp (Real Estate Japan)
 * 
 * This script scrapes property details from the Japanese real estate website
 * and outputs the results as JSON or CSV.
 * 
 * Requirements:
 * - Node.js
 * - npm packages: puppeteer, csv-writer
 * 
 * To install dependencies:
 * npm install puppeteer csv-writer
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

// Import configuration
const { config: defaultConfig, mergeConfig } = require('./fudousan-config');

// Function to format date for filenames
const getFormattedDate = () => {
  const date = new Date();
  return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
};

// Main scraper function
async function scrapeProperties(userConfig = {}) {
  // Merge user configuration with default configuration
  const config = mergeConfig(userConfig);
  
  console.log('Starting property scraper for fudousan.or.jp...');
  console.log(`Configuration: ${config.search.type} ${config.search.propertyType} in ${config.search.location}`);
  
  // Create output directory if it doesn't exist
  await fs.mkdir(config.output.path, { recursive: true });
  
  const browser = await puppeteer.launch({
    headless: config.technical.headless ? "new" : false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent(config.technical.userAgent);
    
    // Set default navigation timeout
    page.setDefaultNavigationTimeout(config.technical.timeout);
    
    // Navigate to the base URL
    await page.goto(config.baseUrl, { waitUntil: 'networkidle2' });
    console.log('Successfully loaded the homepage');

    // Select property search based on configuration
    const searchType = config.search.type;
    try {
      if (searchType === 'buy') {
        // Try multiple possible selectors for the buy link
        const buyLink = await page.$(config.selectors.navigation.buyLink);
        if (buyLink) {
          await buyLink.click();
          console.log('Selected "Buy" property search');
        } else {
          // Alternative approach: try clicking directly on property types
          console.log('Buy link not found, trying direct property type navigation');
          const propertyType = config.search.propertyType;
          const selector = config.selectors.buy[propertyType];
          const typeLink = await page.$(selector);
          
          if (typeLink) {
            await typeLink.click();
            console.log(`Directly selected ${propertyType} for buying`);
          } else {
            throw new Error(`Could not find navigation elements for buying ${propertyType}`);
          }
        }
      } else {
        // Try multiple possible selectors for the rent link
        const rentLink = await page.$(config.selectors.navigation.rentLink);
        if (rentLink) {
          await rentLink.click();
          console.log('Selected "Rent" property search');
        } else {
          // Alternative approach: try clicking directly on property types
          console.log('Rent link not found, trying direct property type navigation');
          const propertyType = config.search.propertyType;
          const selector = config.selectors.rent[propertyType];
          const typeLink = await page.$(selector);
          
          if (typeLink) {
            await typeLink.click();
            console.log(`Directly selected ${propertyType} for renting`);
          } else {
            throw new Error(`Could not find navigation elements for renting ${propertyType}`);
          }
        }
      }
      
      // Wait for navigation to complete
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: config.technical.timeout });
    } catch (error) {
      console.error(`Error during navigation: ${error.message}`);
      console.log('Taking a screenshot to diagnose the issue...');
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'navigation-error.png' });
      
      // Try an alternative approach - search directly
      console.log('Trying alternative navigation approach...');
      
      // Look for search form or direct property links
      const searchForm = await page.$('form[action*="search"], form[id*="search"]');
      if (searchForm) {
        console.log('Found search form, proceeding with form-based search');
      } else {
        throw error; // If we can't find a search form either, rethrow the error
      }
    }

    // Wait for the search page to load
    try {
      await page.waitForSelector('form', { timeout: config.technical.timeout });
      console.log('Search page loaded');
    } catch (error) {
      console.log('Could not find a form element, may already be on the search results page');
    }

    // Select property type based on configuration (if not already selected)
    try {
      const propertyType = config.search.propertyType;
      const typeSelectors = searchType === 'buy' ? config.selectors.buy : config.selectors.rent;
      
      // Try to find and click the property type selector
      const typeSelector = await page.$(typeSelectors[propertyType]);
      if (typeSelector) {
        await typeSelector.click();
        console.log(`Selected property type: ${propertyType}`);
      } else {
        console.log(`Property type ${propertyType} selector not found, it may be already selected or not available`);
        
        // Take a screenshot for debugging purposes
        await page.screenshot({ path: 'property-type-error.png' });
      }
    } catch (error) {
      console.error(`Error selecting property type: ${error.message}`);
      // Continue anyway as it might already be selected
    }

    // Enter location
    try {
      const locationInput = await page.$(config.selectors.locationInput);
      if (locationInput) {
        await locationInput.click();
        await locationInput.type(config.search.location);
        console.log(`Entered location: ${config.search.location}`);
      } else {
        console.log('Location input not found, skipping location filter');
      }
    } catch (error) {
      console.error(`Error entering location: ${error.message}`);
      // Continue with the search anyway
    }
    
    // Add any additional filters if specified
    if (config.filters) {
      console.log('Applying additional filters...');
      
      try {
        // Price range
        if (config.filters.priceMin) {
          // Find and set minimum price field
          const priceMinInput = await page.$('input[name*="price_min"], input[name*="kakaku_min"]');
          if (priceMinInput) {
            await priceMinInput.type(config.filters.priceMin.toString());
            console.log(`Set minimum price: ${config.filters.priceMin}`);
          }
        }
        
        if (config.filters.priceMax) {
          // Find and set maximum price field
          const priceMaxInput = await page.$('input[name*="price_max"], input[name*="kakaku_max"]');
          if (priceMaxInput) {
            await priceMaxInput.type(config.filters.priceMax.toString());
            console.log(`Set maximum price: ${config.filters.priceMax}`);
          }
        }
        
        // Size range
        if (config.filters.sizeMin) {
          const sizeMinInput = await page.$('input[name*="size_min"], input[name*="menseki_min"]');
          if (sizeMinInput) {
            await sizeMinInput.type(config.filters.sizeMin.toString());
            console.log(`Set minimum size: ${config.filters.sizeMin}`);
          }
        }
        
        // Apply other filters as needed
      } catch (error) {
        console.error(`Error applying filters: ${error.message}`);
        // Continue with the search anyway
      }
    }

    // Submit the search form
    try {
      // Find the submit button
      const submitButton = await page.$(config.selectors.submitButton);
      
      if (submitButton) {
        console.log('Found submit button, submitting search form...');
        await Promise.all([
          submitButton.click(),
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: config.technical.timeout })
        ]);
        console.log('Search form submitted successfully');
      } else {
        // If no submit button found, try hitting Enter on the location input
        console.log('No submit button found, trying Enter key on location input');
        const locationInput = await page.$(config.selectors.locationInput);
        
        if (locationInput) {
          await Promise.all([
            locationInput.press('Enter'),
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: config.technical.timeout })
          ]);
          console.log('Search triggered via Enter key');
        } else {
          console.log('Could not find a way to submit the search, may already be on results page');
        }
      }
    } catch (error) {
      console.error(`Error submitting search: ${error.message}`);
      console.log('Taking screenshot to diagnose the issue...');
      await page.screenshot({ path: 'search-form-error.png' });
      
      // Let's see if we might already be on a results page
      const hasResults = await page.$(config.selectors.propertyList) !== null;
      if (!hasResults) {
        throw new Error('Could not submit search and no results were found');
      }
      
      console.log('May already be on results page, continuing...');
    }

    // Array to store all properties
    const allProperties = [];

    // Scrape multiple pages
    for (let currentPage = 1; currentPage <= config.search.maxPages; currentPage++) {
      console.log(`Scraping page ${currentPage}...`);
      
      // Wait for property listings to load
      try {
        await page.waitForSelector(config.selectors.propertyList, { 
          timeout: config.technical.timeout 
        });
        console.log('Property listings loaded');
      } catch (error) {
        console.error(`Error waiting for property listings: ${error.message}`);
        console.log('Taking screenshot of current page...');
        await page.screenshot({ path: `page-${currentPage}-error.png` });
        
        // Check if there are any items even if the main container wasn't found
        const anyListings = await page.$(config.selectors.propertyItem);
        if (!anyListings) {
          console.log('No property listings found on this page, ending search');
          break;
        }
        
        console.log('Found individual property items, continuing despite error');
      }
      
      // Extract property listings from the current page
      const properties = await page.evaluate((selectors) => {
        // Try to find property items even if the main container wasn't found
        const listings = Array.from(document.querySelectorAll(selectors.propertyItem));
        console.log(`Found ${listings.length} listings`);
        
        if (listings.length === 0) {
          // If no specific item selectors worked, look for any divs or sections that might contain listings
          const potentialListings = Array.from(document.querySelectorAll('div.item, section.item, div.property, article, div.card, .list-item'));
          if (potentialListings.length > 0) {
            console.log(`Found ${potentialListings.length} potential listings using generic selectors`);
            return potentialListings.map(extractPropertyInfo);
          }
          return [];
        }
        
        return listings.map(extractPropertyInfo);
        
        // Helper function to extract property information
        function extractPropertyInfo(listing) {
          // Try multiple selector patterns for each piece of information
          const title = findContent(listing, ['.property-title', '.bukken-title', 'h2', 'h3', '.title', '[class*="title"]']);
          const price = findContent(listing, ['.price', '.kakaku', '[class*="price"]', 'strong']);
          const address = findContent(listing, ['.address', '.jusho', '[class*="address"]', '[class*="location"]']);
          const sqm = findContent(listing, ['.size', '.menseki', '[class*="size"]', '[class*="area"]']);
          const rooms = findContent(listing, ['.rooms', '.madori', '[class*="layout"]', '[class*="room"]']);
          const yearBuilt = findContent(listing, ['.year', '.chikunen', '[class*="year"]', '[class*="built"]']);
          const stationAccess = findContent(listing, ['.station', '.eki', '[class*="station"]', '[class*="access"]']);
          const propertyType = findContent(listing, ['.type', '.bukken-type', '[class*="type"]', '[class*="category"]']);
          const description = findContent(listing, ['.description', '.shosai', '[class*="description"]', 'p']);
          
          // Find the image URL
          let imageUrl = 'N/A';
          const imgTag = listing.querySelector('img');
          if (imgTag) {
            imageUrl = imgTag.src || imgTag.getAttribute('data-src') || 'N/A';
          }
          
          // Find the detail URL
          let detailUrl = 'N/A';
          const anchors = Array.from(listing.querySelectorAll('a'));
          for (const anchor of anchors) {
            const href = anchor.href;
            if (href && (href.includes('detail') || href.includes('property'))) {
              detailUrl = href;
              break;
            }
          }
          
          // If no detail link was found, use any link
          if (detailUrl === 'N/A' && anchors.length > 0) {
            detailUrl = anchors[0].href || 'N/A';
          }
          
          return {
            title,
            price,
            address,
            sqm,
            rooms,
            yearBuilt,
            stationAccess,
            propertyType,
            description,
            imageUrl,
            detailUrl
          };
        }
        
        // Helper function to find content with multiple selectors
        function findContent(element, selectors) {
          for (const selector of selectors) {
            const found = element.querySelector(selector);
            if (found && found.textContent.trim()) {
              return found.textContent.trim();
            }
          }
          return 'N/A';
        }
      }, config.selectors);
      
      console.log(`Found ${properties.length} properties on page ${currentPage}`);
      allProperties.push(...properties);
      
      // Check if there's a next page button
      const hasNextPage = await page.evaluate((nextPageSelector) => {
        const nextButton = document.querySelector(nextPageSelector);
        return nextButton && !nextButton.disabled;
      }, config.selectors.nextPage);
      
      if (!hasNextPage || currentPage >= config.search.maxPages) {
        console.log('No more pages or reached maximum page limit');
        break;
      }
      
      // Navigate to the next page
      try {
        await Promise.all([
          page.click(config.selectors.nextPage),
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: config.technical.timeout })
        ]);
        console.log('Navigated to next page');
      } catch (error) {
        console.error(`Error navigating to next page: ${error.message}`);
        console.log('Taking screenshot to diagnose the issue...');
        await page.screenshot({ path: `next-page-error-${currentPage}.png` });
        break;
      }
    }

    
    console.log(`Total properties scraped: ${allProperties.length}`);
    
    // Save the scraped data
    const timestamp = getFormattedDate();
    
    if (config.output.format === 'json') {
      const jsonOutputPath = path.join(config.output.path, `fudousan_properties_${timestamp}.json`);
      await fs.writeFile(jsonOutputPath, JSON.stringify(allProperties, null, 2), 'utf8');
      console.log(`Data saved as JSON: ${jsonOutputPath}`);
      
      // Return the file path
      return {
        filePath: jsonOutputPath,
        properties: allProperties,
        count: allProperties.length
      };
    } else if (config.output.format === 'csv') {
      const csvOutputPath = path.join(config.output.path, `fudousan_properties_${timestamp}.csv`);
      
      const csvWriter = createCsvWriter({
        path: csvOutputPath,
        header: [
          { id: 'title', title: 'Title' },
          { id: 'price', title: 'Price' },
          { id: 'address', title: 'Address' },
          { id: 'sqm', title: 'Size (sqm)' },
          { id: 'rooms', title: 'Rooms' },
          { id: 'yearBuilt', title: 'Year Built' },
          { id: 'stationAccess', title: 'Station Access' },
          { id: 'propertyType', title: 'Property Type' },
          { id: 'description', title: 'Description' },
          { id: 'imageUrl', title: 'Image URL' },
          { id: 'detailUrl', title: 'Detail URL' }
        ]
      });
      
      await csvWriter.writeRecords(allProperties);
      console.log(`Data saved as CSV: ${csvOutputPath}`);
      
      // Return the file path
      return {
        filePath: csvOutputPath,
        properties: allProperties,
        count: allProperties.length
      };
    }
    
    // Optional: Enhance the scraper to get detailed information from each property page
    if (allProperties.length > 0 && allProperties[0].detailUrl !== 'N/A') {
      console.log('Would you like to scrape detailed information for each property? (y/n)');
      // This would be handled by user input in an actual application
    }
    
  } catch (error) {
    console.error('An error occurred during scraping:', error);
  } finally {
    await browser.close();
    console.log('Browser closed. Scraping completed.');
  }
}

// Function to scrape detailed information for a specific property
async function scrapePropertyDetail(browser, url) {
  console.log(`Scraping detailed information from: ${url}`);
  
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: config.timeout });
  
  const detailData = await page.evaluate(() => {
    // These selectors would need to be adjusted based on the actual detail page structure
    const details = {};
    const tableRows = Array.from(document.querySelectorAll('table tr, .detail-table tr'));
    
    tableRows.forEach(row => {
      const label = row.querySelector('th')?.textContent.trim();
      const value = row.querySelector('td')?.textContent.trim();
      
      if (label && value) {
        details[label] = value;
      }
    });
    
    // Additional specific details
    details.fullDescription = document.querySelector('.full-description, .property-description')?.textContent.trim() || 'N/A';
    details.agentInfo = document.querySelector('.agent-info, .fudousan-info')?.textContent.trim() || 'N/A';
    
    // Get all images
    const images = Array.from(document.querySelectorAll('.property-images img, .bukken-images img')).map(img => img.src);
    details.images = images;
    
    return details;
  });
  
  await page.close();
  return detailData;
}

// Execute the script
// scrapeProperties();

// Export the function for use in other modules
module.exports = {
  scrapeProperties,
  scrapePropertyDetail
};

// If this script is run directly, start scraping
if (require.main === module) {
  scrapeProperties();
}