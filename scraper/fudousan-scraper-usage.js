/**
 * Example usage of the Fudousan.or.jp Property Scraper
 * 
 * This script demonstrates how to use the property scraper
 * with different configuration options.
 */

const { scrapeProperties } = require('./fudousan-scraper');
const { scrapePropertyDetails } = require('./fudousan-detail-scraper');
const { config, presets, applyPreset, mergeConfig } = require('./fudousan-config.js');

// Example 1: Scrape apartments for sale in Tokyo using preset
async function scrapeTokyoApartments() {
  // Apply the Tokyo apartments preset
  const tokyoConfig = applyPreset('tokyoApartments');
  
  // Customize output format and path
  tokyoConfig.output.format = 'json';
  tokyoConfig.output.path = './output/tokyo';
  
  // Run the scraper with this configuration
  const result = await scrapeProperties(tokyoConfig);
  console.log(`Scraped ${result.count} Tokyo apartments. Data saved to ${result.filePath}`);
  
  return result;
}

// Example 2: Scrape houses for rent in Osaka using preset
async function scrapeOsakaRentals() {
  // Apply the Osaka house rentals preset
  const osakaConfig = applyPreset('osakaHouseRentals');
  
  // Customize output
  osakaConfig.output.format = 'csv';
  osakaConfig.output.path = './output/osaka';
  
  // Limit to 3 pages maximum
  osakaConfig.search.maxPages = 3;
  
  // Run the scraper with this configuration
  const result = await scrapeProperties(osakaConfig);
  console.log(`Scraped ${result.count} Osaka rental houses. Data saved to ${result.filePath}`);
  
  return result;
}

// Example 3: Scrape commercial properties in Yokohama using custom config
async function scrapeYokohamaCommercial() {
  // Create a custom configuration by merging with the default config
  const customConfig = mergeConfig({
    search: {
      type: 'buy',
      propertyType: 'business',
      location: '横浜市', // Yokohama
      maxPages: 2
    },
    output: {
      format: 'json',
      path: './output/yokohama'
    },
    // Add custom filters
    filters: {
      priceMin: 50000000, // 50 million yen minimum
      sizeMin: 100 // 100 square meters minimum
    }
  });
  
  // Run the scraper with this configuration
  const result = await scrapeProperties(customConfig);
  console.log(`Scraped ${result.count} Yokohama commercial properties. Data saved to ${result.filePath}`);
  
  return result;
}

// Example 4: First scrape properties, then scrape detailed info for each property
async function scrapePropertiesWithDetails() {
  console.log('Step 1: Scraping property listings...');
  
  // Use a preset with minimal configuration to find properties
  const minimalConfig = applyPreset('tokyoApartments');
  minimalConfig.search.maxPages = 1; // Just get a few properties for the example
  
  // Run the initial property scraper
  const listingResult = await scrapeProperties(minimalConfig);
  console.log(`Found ${listingResult.count} properties`);
  
  // Extract the detail URLs from the properties
  const detailUrls = listingResult.properties
    .map(property => property.detailUrl)
    .filter(url => url && url !== 'N/A');
  
  if (detailUrls.length === 0) {
    console.log('No detail URLs found to scrape');
    return;
  }
  
  console.log(`Step 2: Scraping detailed information for ${detailUrls.length} properties...`);
  
  // Configure detail scraper settings
  const detailConfig = mergeConfig({
    output: {
      format: 'json',
      path: './output/details'
    },
    detailScraper: {
      concurrentScrapes: 2, // Reduce concurrency for the example
      extractImages: true,
      extractNearbyFacilities: true,
      extractAgentInfo: true
    }
  });
  
  // Run the detail scraper on the URLs
  const detailResult = await scrapePropertyDetails(detailUrls, detailConfig);
  console.log(`Scraped detailed information for ${detailResult.count} properties. Data saved to ${detailResult.filePath}`);
  
  return {
    listings: listingResult,
    details: detailResult
  };
}

// Run one of the example functions
async function main() {
  console.log('Fudousan.or.jp Property Scraper Usage Examples');
  console.log('==============================================');
  console.log('Select an example to run:');
  console.log('1. Scrape apartments for sale in Tokyo');
  console.log('2. Scrape houses for rent in Osaka');
  console.log('3. Scrape commercial properties in Yokohama');
  console.log('4. Scrape properties and their detailed information');
  
  // In a real application, you would handle user input here
  // For this example, we'll just run the first example
  try {
    console.log('\nRunning Example 1: Tokyo Apartments\n');
    await scrapeTokyoApartments();
    
    // Uncomment the following lines to run the other examples
    // console.log('\nRunning Example 2: Osaka Rentals\n');
    // await scrapeOsakaRentals();
    
    // console.log('\nRunning Example 3: Yokohama Commercial\n');
    // await scrapeYokohamaCommercial();
    
    // console.log('\nRunning Example 4: Properties with Details\n');
    // await scrapePropertiesWithDetails();
    
    console.log('\nAll examples completed successfully!');
  } catch (error) {
    console.error('Error during execution:', error);
  }
}

// Execute the main function
if (require.main === module) {
  main();
}

// Export the examples for use in other modules
module.exports = {
  scrapeTokyoApartments,
  scrapeOsakaRentals,
  scrapeYokohamaCommercial,
  scrapePropertiesWithDetails
};