/**
 * Detail Scraper for fudousan.or.jp (Real Estate Japan)
 * 
 * This script takes a list of property URLs and scrapes detailed information
 * from each property's individual page.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Import configuration
const { config: defaultConfig, mergeConfig } = require('./fudousan-config.js');

/**
 * Scrape detailed information from individual property pages
 * @param {string[]} propertyUrls - Array of property detail page URLs
 * @param {object} userConfig - User configuration options
 * @returns {Promise<Array>} - Array of property details
 */
async function scrapePropertyDetails(propertyUrls, userConfig = {}) {
  // Merge user configuration with default configuration
  const config = mergeConfig(userConfig);

  console.log(`Starting detail scraper for ${propertyUrls.length} properties...`);
  
  // Create output directory if it doesn't exist
  await fs.mkdir(config.output.path, { recursive: true });
  
  const browser = await puppeteer.launch({
    headless: config.technical.headless ? "new" : false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const propertyDetails = [];
  let processedCount = 0;

  try {
      const batch = propertyUrls.slice(i, i + config.concurrentScrapes);
      const batchPromises = batch.map(url => scrapeDetailPage(browser, url, config.timeout));
      
      const batchResults = await Promise.all(batchPromises);
      propertyDetails.push(...batchResults);
      
      processedCount += batch.length;
      console.log(`Processed ${processedCount} of ${propertyUrls.length} properties`);

    // Save the scraped data
    const timestamp = getFormattedDate();
    
    if (config.output.format === 'json') {
      const jsonOutputPath = path.join(config.output.path, `fudousan_details_${timestamp}.json`);
      await fs.writeFile(jsonOutputPath, JSON.stringify(propertyDetails, null, 2), 'utf8');
      console.log(`Data saved as JSON: ${jsonOutputPath}`);
      
      // Return the results and file path
      return {
        filePath: jsonOutputPath,
        properties: propertyDetails,
        count: propertyDetails.length
      };
    }
    
    return {
      properties: propertyDetails,
      count: propertyDetails.length
    };        
  } catch (error) {
    console.error('An error occurred during detail scraping:', error);
    return propertyDetails; // Return whatever we've collected so far
  } finally {
    await browser.close();
    console.log('Browser closed. Detail scraping completed.');
  }

}

/**
 * Scrape a single property detail page
 * @param {Browser} browser - Puppeteer browser instance
 * @param {string} url - URL of the property detail page
 * @param {object} config - Configuration object
 * @returns {Promise<object>} - Property details
 */
async function scrapeDetailPage(browser, url, config) {
  console.log(`Scraping details from: ${url}`);
  
  const page = await browser.newPage();
  
  // Set user agent
  await page.setUserAgent(config.technical.userAgent);
  
  page.setDefaultNavigationTimeout(config.technical.timeout);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Extract detailed property information based on configuration
    const detailData = await page.evaluate((config) => {
      const data = {
        url: window.location.href,
        title: document.querySelector('h1, .property-title, .bukken-title')?.textContent.trim() || 'N/A',
        images: [],
        details: {},
        features: [],
        agentInfo: {},
        nearbyFacilities: []
      };
      
      // Extract images if configured to do so
      if (config.detailScraper.extractImages) {
        const imageElements = document.querySelectorAll('.property-images img, .gallery img, .bukken-images img');
        data.images = Array.from(imageElements).map(img => img.src);
      }
      
      // Extract property details from tables
      const detailRows = document.querySelectorAll('table tr, .detail-table tr, .property-details tr');
      detailRows.forEach(row => {
        const label = row.querySelector('th')?.textContent.trim();
        const value = row.querySelector('td')?.textContent.trim();
        
        if (label && value) {
          // Clean up the label by removing colons, spaces, etc.
          const cleanLabel = label.replace(/[:：]$/, '').trim();
          data.details[cleanLabel] = value;
        }
      });
      
      // Extract property features/amenities
      const featureElements = document.querySelectorAll('.features li, .amenities li, .property-features li');
      data.features = Array.from(featureElements).map(el => el.textContent.trim());
      
      // Extract agent/company information if configured
      if (config.detailScraper.extractAgentInfo) {
        const agentSection = document.querySelector('.agent-info, .realtor-info, .company-info');
        if (agentSection) {
          data.agentInfo = {
            name: agentSection.querySelector('.name, .company-name')?.textContent.trim() || 'N/A',
            address: agentSection.querySelector('.address')?.textContent.trim() || 'N/A',
            phone: agentSection.querySelector('.phone, .tel')?.textContent.trim() || 'N/A',
            license: agentSection.querySelector('.license')?.textContent.trim() || 'N/A'
          };
        }
      }
      
      // Extract nearby facilities if configured
      if (config.detailScraper.extractNearbyFacilities) {
        const facilityElements = document.querySelectorAll('.nearby-facilities li, .surrounding-facilities li');
        data.nearbyFacilities = Array.from(facilityElements).map(el => el.textContent.trim());
      }
      
      // Extract full description text
      data.fullDescription = document.querySelector('.description, .full-description, .property-description')?.textContent.trim() || 'N/A';
      
      // Extract latitude and longitude if available
      const mapElement = document.querySelector('[data-lat], [data-lng], [data-latitude], [data-longitude]');
      if (mapElement) {
        data.location = {
          latitude: mapElement.getAttribute('data-lat') || mapElement.getAttribute('data-latitude') || 'N/A',
          longitude: mapElement.getAttribute('data-lng') || mapElement.getAttribute('data-longitude') || 'N/A'
        };
      }
      
      return data;
    }, config);
    
    return {
      url,
      ...detailData,
      scrapedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      url,
      error: error.message,
      scrapedAt: new Date().toISOString()
    };
  } finally {
    await page.close();
  }
}

// Helper function to format date for filenames
function getFormattedDate() {
  const date = new Date();
  return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
}

// Example usage
async function runExample() {
  // This would typically come from a previous scrape or input file
  const exampleUrls = [
    'https://www.fudousan.or.jp/property/123',
    'https://www.fudousan.or.jp/property/456'
  ];
  
  const details = await scrapePropertyDetails(exampleUrls, {
    outputPath: './output',
    outputFormat: 'json'
  });
  
  console.log(`Successfully scraped ${details.length} property details`);
}

// Export functions for use in other modules
module.exports = {
  scrapePropertyDetails,
  scrapeDetailPage
};

// If this script is run directly, run the example
if (require.main === module) {
  runExample()
    .then(() => console.log('Example completed'))
    .catch(error => console.error('Error running example:', error));
}