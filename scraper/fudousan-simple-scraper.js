/**
 * Simple Property Scraper for fudousan.or.jp (Real Estate Japan)
 * 
 * This simplified scraper uses a direct approach to navigate and extract data from
 * the Japanese real estate website.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  baseUrl: 'https://www.fudousan.or.jp',
  searchParams: {
    type: 'buy', // 'buy' or 'rent'
    propertyType: 'mansion', // 'mansion', 'house', 'land', 'business'
    location: '東京都', // Location in Japanese (e.g., Tokyo)
    minPrice: 50000000, // Minimum price in JPY (optional)
    maxPrice: 100000000, // Maximum price in JPY (optional)
  },
  scraping: {
    maxPages: 5, // Maximum number of pages to scrape
    timeout: 30000, // Navigation timeout in milliseconds
    outputPath: './output', // Output directory
    takeScreenshots: true // Take screenshots during scraping for debugging
  }
};

/**
 * Main scraper function
 */
async function scrapeProperties() {
  console.log('Starting simple scraper for fudousan.or.jp...');
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
    
    // Navigate to the homepage
    await page.goto(config.baseUrl, { waitUntil: 'networkidle2' });
    console.log('Successfully loaded the homepage');
    
    if (config.scraping.takeScreenshots) {
      await page.screenshot({ path: path.join(config.scraping.outputPath, 'homepage.png') });
    }
    
    // Step 1: Analyze the page to find the correct navigation elements
    console.log('Analyzing page structure...');
    
    const navigationLinks = await page.evaluate(() => {
      // Get all links on the page
      const allLinks = Array.from(document.querySelectorAll('a'));
      
      // Extract href and text content
      return allLinks.map(link => ({
        href: link.href,
        text: link.textContent.trim(),
        isVisible: link.offsetParent !== null
      }));
    });
    
    console.log(`Found ${navigationLinks.length} navigation links on the page`);
    
    // Find buy/rent links
    let targetLink = null;
    if (config.searchParams.type === 'buy') {
      // Look for buy links in Japanese
      const buyKeywords = ['買う', '購入', 'マンション購入', '物件を買う'];
      targetLink = navigationLinks.find(link => 
        buyKeywords.some(keyword => link.text.includes(keyword) || link.href.includes(keyword)) && 
        link.isVisible
      );
    } else {
      // Look for rent links in Japanese
      const rentKeywords = ['借りる', '賃貸', 'レンタル', '物件を借りる'];
      targetLink = navigationLinks.find(link => 
        rentKeywords.some(keyword => link.text.includes(keyword) || link.href.includes(keyword)) && 
        link.isVisible
      );
    }
    
    // Fallback to direct search URL if links not found
    let searchUrl;
    if (targetLink) {
      console.log(`Found navigation link: ${targetLink.text} (${targetLink.href})`);
      searchUrl = targetLink.href;
    } else {
      console.log('Could not find appropriate navigation link, using direct search URL');
      searchUrl = config.searchParams.type === 'buy'
        ? `${config.baseUrl}/buy/search` 
        : `${config.baseUrl}/rent/search`;
    }
    
    // Navigate to the search page
    console.log(`Navigating to search page: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    if (config.scraping.takeScreenshots) {
      await page.screenshot({ path: path.join(config.scraping.outputPath, 'search_page.png') });
    }
    
    // Step 2: Try to find and interact with the search form
    console.log('Looking for search form elements...');
    
    // Analyze the page to find form inputs
    const formElements = await page.evaluate(() => {
      // Find all form elements
      const forms = Array.from(document.querySelectorAll('form'));
      const inputs = Array.from(document.querySelectorAll('input'));
      const selects = Array.from(document.querySelectorAll('select'));
      const buttons = Array.from(document.querySelectorAll('button, input[type="submit"]'));
      
      return {
        forms: forms.map(form => ({
          id: form.id,
          action: form.action,
          method: form.method,
          inputCount: form.querySelectorAll('input, select').length
        })),
        inputs: inputs.map(input => ({
          type: input.type,
          name: input.name,
          id: input.id,
          placeholder: input.placeholder,
          value: input.value,
          isVisible: input.offsetParent !== null
        })),
        selects: selects.map(select => ({
          name: select.name,
          id: select.id,
          options: Array.from(select.options).map(opt => ({
            value: opt.value,
            text: opt.textContent.trim()
          })),
          isVisible: select.offsetParent !== null
        })),
        buttons: buttons.map(button => ({
          type: button.type,
          text: button.textContent.trim(),
          isVisible: button.offsetParent !== null
        }))
      };
    });
    
    console.log(`Found ${formElements.forms.length} forms, ${formElements.inputs.length} inputs, ${formElements.selects.length} selects, and ${formElements.buttons.length} buttons`);
    
    // Try to identify location input
    let locationInput = formElements.inputs.find(input => 
      (input.name && input.name.includes('area')) || 
      (input.placeholder && input.placeholder.includes('地域')) ||
      (input.id && input.id.includes('location'))
    );
    
    if (locationInput) {
      console.log(`Found location input: ${locationInput.name || locationInput.id}`);
      
      try {
        // Clear the input if it has a value
        await page.evaluate((selector) => {
          const input = document.querySelector(selector);
          if (input) input.value = '';
        }, `input[name="${locationInput.name}"], input[id="${locationInput.id}"]`);
        
        // Type location
        await page.type(
          `input[name="${locationInput.name}"], input[id="${locationInput.id}"]`, 
          config.searchParams.location
        );
        console.log(`Entered location: ${config.searchParams.location}`);
      } catch (error) {
        console.error(`Error entering location: ${error.message}`);
      }
    } else {
      console.log('Could not find location input');
      
      // Try to find any text input
      const anyTextInput = formElements.inputs.find(input => 
        input.type === 'text' && input.isVisible
      );
      
      if (anyTextInput) {
        console.log('Trying first available text input for location');
        try {
          await page.type(
            `input[name="${anyTextInput.name}"], input[id="${anyTextInput.id}"]`,
            config.searchParams.location
          );
          console.log(`Entered location: ${config.searchParams.location}`);
        } catch (error) {
          console.error(`Error entering location in generic text input: ${error.message}`);
        }
      }
    }
    
    // Try to identify property type selection
    if (config.searchParams.propertyType) {
      console.log(`Looking for property type selection for: ${config.searchParams.propertyType}`);
      
      let propertyTypeMatches = {
        'mansion': ['マンション', 'mansion', 'apartment'],
        'house': ['一戸建て', 'house', 'detached'],
        'land': ['土地', 'land', 'plot'],
        'business': ['事業用', 'business', 'commercial']
      };
      
      let targetWords = propertyTypeMatches[config.searchParams.propertyType];
      
      // Try to find radio buttons or checkboxes for property type
      try {
        const propertyTypeSelected = await page.evaluate((targetWords) => {
          // Look for inputs (radio/checkbox) with matching labels or values
          const inputs = Array.from(document.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
          
          for (const input of inputs) {
            // Check input value
            if (targetWords.some(word => input.value.includes(word))) {
              input.click();
              return true;
            }
            
            // Check associated label
            const inputId = input.id;
            if (inputId) {
              const label = document.querySelector(`label[for="${inputId}"]`);
              if (label && targetWords.some(word => label.textContent.includes(word))) {
                input.click();
                return true;
              }
            }
            
            // Check parent label
            const parentLabel = input.closest('label');
            if (parentLabel && targetWords.some(word => parentLabel.textContent.includes(word))) {
              input.click();
              return true;
            }
          }
          
          // If no input found, try finding and clicking links with matching text
          const links = Array.from(document.querySelectorAll('a'));
          for (const link of links) {
            if (targetWords.some(word => link.textContent.includes(word) || link.href.includes(word))) {
              link.click();
              return true;
            }
          }
          
          return false;
        }, targetWords);
        
        if (propertyTypeSelected) {
          console.log(`Selected property type: ${config.searchParams.propertyType}`);
        } else {
          console.log(`Could not find property type selector for ${config.searchParams.propertyType}`);
        }
      } catch (error) {
        console.error(`Error selecting property type: ${error.message}`);
      }
    }
    
    // Set price range if specified
    if (config.searchParams.minPrice || config.searchParams.maxPrice) {
      console.log('Trying to set price range...');
      
      try {
        // Find price inputs
        const priceInputs = formElements.inputs.filter(input => 
          (input.name && (input.name.includes('price') || input.name.includes('kakaku'))) ||
          (input.id && (input.id.includes('price') || input.id.includes('kakaku')))
        );
        
        if (priceInputs.length > 0) {
          console.log(`Found ${priceInputs.length} price-related inputs`);
          
          // Try to identify min and max
          const minPriceInput = priceInputs.find(input => 
            input.name?.includes('min') || input.id?.includes('min') || 
            input.name?.includes('from') || input.id?.includes('from')
          );
          
          const maxPriceInput = priceInputs.find(input => 
            input.name?.includes('max') || input.id?.includes('max') || 
            input.name?.includes('to') || input.id?.includes('to')
          );
          
          if (minPriceInput && config.searchParams.minPrice) {
            await page.type(
              `input[name="${minPriceInput.name}"], input[id="${minPriceInput.id}"]`,
              config.searchParams.minPrice.toString()
            );
            console.log(`Set minimum price: ${config.searchParams.minPrice}`);
          }
          
          if (maxPriceInput && config.searchParams.maxPrice) {
            await page.type(
              `input[name="${maxPriceInput.name}"], input[id="${maxPriceInput.id}"]`,
              config.searchParams.maxPrice.toString()
            );
            console.log(`Set maximum price: ${config.searchParams.maxPrice}`);
          }
        } else {
          console.log('No price inputs found');
        }
      } catch (error) {
        console.error(`Error setting price range: ${error.message}`);
      }
    }
    
    // Submit the search form
    console.log('Attempting to submit search form...');
    
    if (config.scraping.takeScreenshots) {
      await page.screenshot({ path: path.join(config.scraping.outputPath, 'before_submit.png') });
    }
    
    let searchSubmitted = false;
    
    try {
      // First try to find and click a submit button
      const searchButton = formElements.buttons.find(button => 
        button.isVisible && (
          button.type === 'submit' || 
          button.text.includes('検索') || // "Search" in Japanese
          button.text.includes('Search')
        )
      );
      
      if (searchButton) {
        console.log(`Found search button with text: ${searchButton.text}`);
        
        // Click the button and wait for navigation
        await Promise.all([
          page.click(`button:contains("${searchButton.text}"), input[type="submit"][value*="${searchButton.text}"]`),
          page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);
        
        searchSubmitted = true;
        console.log('Search form submitted by clicking search button');
      } else {
        // If no button found, try submitting the form directly
        const mainForm = formElements.forms.length > 0 ? formElements.forms[0] : null;
        
        if (mainForm) {
          console.log(`Trying to submit form directly: ${mainForm.id || 'unnamed form'}`);
          
          await Promise.all([
            page.evaluate(() => {
              document.querySelector('form').submit();
            }),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
          ]);
          
          searchSubmitted = true;
          console.log('Search form submitted directly');
        } else {
          // Try pressing Enter on the location input as last resort
          console.log('No form found, trying to press Enter on location input');
          
          if (locationInput) {
            await Promise.all([
              page.keyboard.press('Enter'),
              page.waitForNavigation({ waitUntil: 'networkidle2' })
            ]);
            
            searchSubmitted = true;
            console.log('Search triggered by pressing Enter');
          }
        }
      }
    } catch (error) {
      console.error(`Error submitting search: ${error.message}`);
      
      // Take a screenshot of the error state
      if (config.scraping.takeScreenshots) {
        await page.screenshot({ path: path.join(config.scraping.outputPath, 'search_error.png') });
      }
    }
    
    if (!searchSubmitted) {
      console.log('Could not submit search form, trying direct URL search');
      
      // Construct a direct search URL based on parameters
      let directSearchUrl = `${config.baseUrl}/${config.searchParams.type === 'buy' ? 'buy' : 'rent'}/`;
      
      if (config.searchParams.propertyType) {
        directSearchUrl += `${config.searchParams.propertyType}/`;
      }
      
      directSearchUrl += `search?area=${encodeURIComponent(config.searchParams.location)}`;
      
      if (config.searchParams.minPrice) {
        directSearchUrl += `&price_min=${config.searchParams.minPrice}`;
      }
      
      if (config.searchParams.maxPrice) {
        directSearchUrl += `&price_max=${config.searchParams.maxPrice}`;
      }
      
      console.log(`Trying direct search URL: ${directSearchUrl}`);
      
      await page.goto(directSearchUrl, { waitUntil: 'networkidle2' });
      console.log('Navigated to direct search URL');
    }
    
    // Take a screenshot of the search results page
    if (config.scraping.takeScreenshots) {
      await page.screenshot({ path: path.join(config.scraping.outputPath, 'search_results.png') });
    }
    
    // Step 3: Extract property listings
    console.log('Analyzing search results page structure...');
    
    // First, let's analyze the structure of the page
    const pageStructure = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        divCount: document.querySelectorAll('div').length,
        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent.trim()),
        images: document.querySelectorAll('img').length,
        links: document.querySelectorAll('a').length,
        possibleListings: [
          document.querySelectorAll('div.property').length,
          document.querySelectorAll('div.listing').length,
          document.querySelectorAll('div.item').length,
          document.querySelectorAll('div.card').length,
          document.querySelectorAll('article').length,
          document.querySelectorAll('div[class*="property"]').length,
          document.querySelectorAll('div[class*="listing"]').length,
          document.querySelectorAll('div[class*="item"]').length,
          document.querySelectorAll('div[class*="result"]').length
        ]
      };
    });
    
    console.log('Page structure analysis:');
    console.log(`- Title: ${pageStructure.title}`);
    console.log(`- URL: ${pageStructure.url}`);
    console.log(`- Divs: ${pageStructure.divCount}`);
    console.log(`- Images: ${pageStructure.images}`);
    console.log(`- Links: ${pageStructure.links}`);
    console.log(`- Possible listing containers: ${JSON.stringify(pageStructure.possibleListings)}`);
    
    // Array of selectors to try for property listings
    const listingSelectors = [
      'div.property', 'div.listing', 'div.item', 'div.card', 'article',
      'div[class*="property"]', 'div[class*="listing"]', 'div[class*="item"]', 
      'div[class*="result"]', '.property-list > *', '.bukken-list > *',
      '.search-results > *', '.result-list > *'
    ];
    
    // Try to extract properties with the most promising selector
    let allProperties = [];
    let usedSelector = null;
    
    for (const selector of listingSelectors) {
      try {
        console.log(`Trying to extract properties with selector: ${selector}`);
        
        const properties = await page.evaluate((selector) => {
          const elements = document.querySelectorAll(selector);
          console.log(`Found ${elements.length} elements with selector ${selector}`);
          
          if (elements.length === 0) return [];
          
          return Array.from(elements).map(el => {
            // Helper function to find text content
            const findText = (parent, selectors) => {
              for (const sel of selectors) {
                const element = parent.querySelector(sel);
                if (element && element.textContent.trim()) {
                  return element.textContent.trim();
                }
              }
              return '';
            };
            
            // Helper function to find an image
            const findImage = (parent) => {
              const img = parent.querySelector('img');
              return img ? (img.src || img.getAttribute('data-src') || '') : '';
            };
            
            // Helper function to find a link
            const findLink = (parent) => {
              const links = Array.from(parent.querySelectorAll('a'));
              
              // First try to find links with detail or property in the URL
              for (const link of links) {
                if (link.href && (link.href.includes('detail') || link.href.includes('property'))) {
                  return link.href;
                }
              }
              
              // If no specific link found, return the first link
              return links.length > 0 ? links[0].href : '';
            };
            
            // Look for common patterns in property listings
            const title = findText(el, ['h2', 'h3', 'h4', '.title', '[class*="title"]', 'strong', 'b']);
            const price = findText(el, ['.price', '[class*="price"]', '.kakaku', '[class*="kakaku"]']);
            const address = findText(el, ['.address', '[class*="address"]', '.location', '[class*="location"]']);
            const description = findText(el, ['.description', '[class*="description"]', 'p', '.text', '[class*="text"]']);
            const imageUrl = findImage(el);
            const detailUrl = findLink(el);
            
            // Look for additional details
            const sqm = findText(el, ['.size', '[class*="size"]', '.area', '[class*="area"]', '.menseki', '[class*="menseki"]']);
            const rooms = findText(el, ['.rooms', '[class*="rooms"]', '.madori', '[class*="madori"]']);
            const yearBuilt = findText(el, ['.year', '[class*="year"]', '.built', '[class*="built"]', '.chikunen', '[class*="chikunen"]']);
            const stationAccess = findText(el, ['.station', '[class*="station"]', '.access', '[class*="access"]', '.eki', '[class*="eki"]']);
            
            // Only return non-empty objects with at least some important data
            if (title || price || address || detailUrl) {
              return {
                title: title || 'N/A',
                price: price || 'N/A',
                address: address || 'N/A',
                sqm: sqm || 'N/A',
                rooms: rooms || 'N/A',
                yearBuilt: yearBuilt || 'N/A',
                stationAccess: stationAccess || 'N/A',
                description: description || 'N/A',
                imageUrl: imageUrl || 'N/A',
                detailUrl: detailUrl || 'N/A'
              };
            }
            
            return null;
          }).filter(item => item !== null);
        }, selector);
        
        if (properties.length > 0) {
          console.log(`Found ${properties.length} properties with selector: ${selector}`);
          allProperties = properties;
          usedSelector = selector;
          break;
        }
      } catch (error) {
        console.error(`Error extracting properties with selector ${selector}: ${error.message}`);
      }
    }
    
    if (allProperties.length === 0) {
      console.log('Could not extract properties with any of the selectors');
      
      // Take a screenshot of the page for debugging
      if (config.scraping.takeScreenshots) {
        await page.screenshot({ path: path.join(config.scraping.outputPath, 'no_properties_found.png') });
      }
      
      // As a last resort, try to extract any divs that might contain property information
      try {
        console.log('Trying to extract any divs that might contain property information...');
        
        const genericProperties = await page.evaluate(() => {
          // Get all divs with some minimum content
          const divs = Array.from(document.querySelectorAll('div')).filter(div => {
            // Must have some minimum content to be considered
            return div.textContent.trim().length > 100 && 
                   div.querySelectorAll('a, img').length > 0;
          });
          
          return divs.slice(0, 10).map(div => ({
            html: div.outerHTML,
            text: div.textContent.trim().substring(0, 200) + '...',
            linkCount: div.querySelectorAll('a').length,
            imageCount: div.querySelectorAll('img').length
          }));
        });
        
        console.log(`Found ${genericProperties.length} potential property containers`);
        
        // Save this information for debugging
        await fs.writeFile(
          path.join(config.scraping.outputPath, 'potential_properties.json'),
          JSON.stringify(genericProperties, null, 2)
        );
      } catch (error) {
        console.error(`Error extracting generic divs: ${error.message}`);
      }
    } else {
      console.log(`Successfully extracted ${allProperties.length} properties with selector: ${usedSelector}`);
      
      // Save the properties to a JSON file
      const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const outputPath = path.join(config.scraping.outputPath, `fudousan_properties_${timestamp}.json`);
      
      await fs.writeFile(outputPath, JSON.stringify(allProperties, null, 2));
      console.log(`Saved ${allProperties.length} properties to ${outputPath}`);
      
      // Save a CSV version as well for convenience
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
      
      const csvPath = path.join(config.scraping.outputPath, `fudousan_properties_${timestamp}.csv`);
      await fs.writeFile(csvPath, csvRows.join('\n'));
      console.log(`Saved ${allProperties.length} properties to ${csvPath}`);
    }
    
  } catch (error) {
    console.error(`An error occurred during scraping: ${error.message}`);
  } finally {
    await browser.close();
    console.log('Browser closed. Scraping completed.');
  }
}

// Run the scraper
scrapeProperties();

module.exports = { scrapeProperties };