/**
 * Fudousan.or.jp Site Analysis and Property Scraper
 * 
 * This script analyzes the structure of the fudousan.or.jp website and
 * attempts to find the correct search mechanism.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  baseUrl: 'https://www.fudousan.or.jp',
  outputPath: './analysis_output',
  takeScreenshots: true
};

/**
 * Analyzes the website structure and saves relevant information
 */
async function analyzeSite() {
  console.log('Starting fudousan.or.jp site analysis...');
  
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Create output directory
    await fs.mkdir(config.outputPath, { recursive: true });
    
    // Initialize page
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    // Navigate to the homepage
    await page.goto(config.baseUrl, { waitUntil: 'networkidle2' });
    console.log('Successfully loaded the homepage');
    
    if (config.takeScreenshots) {
      await page.screenshot({ path: path.join(config.outputPath, 'homepage.png') });
    }
    
    // Extract and save all links on the homepage
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        href: a.href,
        text: a.textContent.trim(),
        hasChildren: a.children.length > 0,
        childText: a.children.length > 0 ? Array.from(a.children).map(child => child.textContent.trim()).join(', ') : '',
        classList: Array.from(a.classList),
        isVisible: a.offsetParent !== null,
        parent: a.parentElement ? {
          tagName: a.parentElement.tagName,
          classList: Array.from(a.parentElement.classList)
        } : null
      }));
    });
    
    console.log(`Found ${links.length} links on the homepage`);
    
    // Save links to a file
    await fs.writeFile(
      path.join(config.outputPath, 'homepage_links.json'), 
      JSON.stringify(links, null, 2)
    );
    
    // Extract and save all forms on the homepage
    const forms = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('form')).map(form => ({
        action: form.action,
        method: form.method,
        id: form.id,
        classList: Array.from(form.classList),
        inputs: Array.from(form.querySelectorAll('input')).map(input => ({
          type: input.type,
          name: input.name,
          id: input.id,
          value: input.value,
          placeholder: input.placeholder
        })),
        selects: Array.from(form.querySelectorAll('select')).map(select => ({
          name: select.name,
          id: select.id,
          options: Array.from(select.options).map(option => ({
            value: option.value,
            text: option.textContent.trim()
          }))
        })),
        buttons: Array.from(form.querySelectorAll('button, input[type="submit"]')).map(button => ({
          type: button.type,
          text: button.textContent.trim(),
          value: button.value
        }))
      }));
    });
    
    console.log(`Found ${forms.length} forms on the homepage`);
    
    // Save forms to a file
    await fs.writeFile(
      path.join(config.outputPath, 'homepage_forms.json'), 
      JSON.stringify(forms, null, 2)
    );
    
    // Extract main navigation structure
    const navigationStructure = await page.evaluate(() => {
      // Try to find main navigation elements
      const navElements = [
        ...document.querySelectorAll('nav'),
        ...document.querySelectorAll('.nav, .navigation, .menu, .global-nav, header'),
        ...document.querySelectorAll('ul:has(> li > a), div:has(> ul > li > a)')
      ];
      
      return navElements.map(nav => ({
        tagName: nav.tagName,
        id: nav.id,
        classList: Array.from(nav.classList),
        links: Array.from(nav.querySelectorAll('a')).map(a => ({
          href: a.href,
          text: a.textContent.trim(),
          hasChildren: a.children.length > 0
        }))
      }));
    });
    
    console.log(`Identified ${navigationStructure.length} potential navigation elements`);
    
    // Save navigation structure to a file
    await fs.writeFile(
      path.join(config.outputPath, 'navigation_structure.json'), 
      JSON.stringify(navigationStructure, null, 2)
    );
    
    // ========== EXPLORING BUY/RENT PAGES ==========
    
    // Try to find and navigate to the "buy" page
    const buyLinks = links.filter(link => 
      (link.text.includes('買う') || link.href.includes('buy') || link.text.includes('購入')) && 
      link.isVisible
    );
    
    console.log(`Found ${buyLinks.length} possible "buy" links`);
    
    if (buyLinks.length > 0) {
      // Navigate to the first buy link
      const buyUrl = buyLinks[0].href;
      console.log(`Navigating to buy page: ${buyUrl}`);
      
      await page.goto(buyUrl, { waitUntil: 'networkidle2' });
      
      if (config.takeScreenshots) {
        await page.screenshot({ path: path.join(config.outputPath, 'buy_page.png') });
      }
      
      // Extract and save the structure of the buy page
      const buyPageStructure = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          forms: Array.from(document.querySelectorAll('form')).map(form => ({
            action: form.action,
            method: form.method,
            id: form.id,
            classList: Array.from(form.classList),
            inputs: Array.from(form.querySelectorAll('input')).map(input => ({
              type: input.type,
              name: input.name,
              id: input.id,
              value: input.value,
              placeholder: input.placeholder
            })),
            selects: Array.from(form.querySelectorAll('select')).map(select => ({
              name: select.name,
              id: select.id,
              options: Array.from(select.options).map(option => ({
                value: option.value,
                text: option.textContent.trim()
              }))
            })),
            buttons: Array.from(form.querySelectorAll('button, input[type="submit"]')).map(button => ({
              type: button.type,
              text: button.textContent.trim(),
              value: button.value
            }))
          })),
          links: Array.from(document.querySelectorAll('a')).slice(0, 50).map(a => ({
            href: a.href,
            text: a.textContent.trim()
          }))
        };
      });
      
      console.log(`Buy page title: ${buyPageStructure.title}`);
      console.log(`Found ${buyPageStructure.forms.length} forms on the buy page`);
      
      // Save buy page structure to a file
      await fs.writeFile(
        path.join(config.outputPath, 'buy_page_structure.json'), 
        JSON.stringify(buyPageStructure, null, 2)
      );
      
      // Look for property type links (mansion, house, etc.)
      const propertyTypeLinks = await page.evaluate(() => {
        const keywords = ['マンション', '一戸建て', '土地', '事業用'];
        
        return Array.from(document.querySelectorAll('a')).filter(a => 
          keywords.some(keyword => a.textContent.includes(keyword) || a.href.includes(keyword))
        ).map(a => ({
          href: a.href,
          text: a.textContent.trim(),
          keyword: keywords.find(keyword => a.textContent.includes(keyword) || a.href.includes(keyword))
        }));
      });
      
      console.log(`Found ${propertyTypeLinks.length} property type links`);
      
      if (propertyTypeLinks.length > 0) {
        // Save property type links to a file
        await fs.writeFile(
          path.join(config.outputPath, 'property_type_links.json'), 
          JSON.stringify(propertyTypeLinks, null, 2)
        );
        
        // Navigate to the first property type link (e.g., mansion)
        const typeUrl = propertyTypeLinks[0].href;
        console.log(`Navigating to property type page: ${typeUrl}`);
        
        await page.goto(typeUrl, { waitUntil: 'networkidle2' });
        
        if (config.takeScreenshots) {
          await page.screenshot({ path: path.join(config.outputPath, 'property_type_page.png') });
        }
        
        // Extract and save the structure of the property type page
        const typePageStructure = await page.evaluate(() => {
          return {
            title: document.title,
            url: window.location.href,
            forms: Array.from(document.querySelectorAll('form')).map(form => ({
              action: form.action,
              method: form.method,
              id: form.id,
              classList: Array.from(form.classList),
              inputs: Array.from(form.querySelectorAll('input')).map(input => ({
                type: input.type,
                name: input.name,
                id: input.id,
                value: input.value,
                placeholder: input.placeholder
              })),
              selects: Array.from(form.querySelectorAll('select')).map(select => ({
                name: select.name,
                id: select.id,
                options: Array.from(select.options).map(option => ({
                  value: option.value,
                  text: option.textContent.trim()
                }))
              })),
              buttons: Array.from(form.querySelectorAll('button, input[type="submit"]')).map(button => ({
                type: button.type,
                text: button.textContent.trim(),
                value: button.value
              }))
            })),
            links: Array.from(document.querySelectorAll('a')).slice(0, 50).map(a => ({
              href: a.href,
              text: a.textContent.trim()
            }))
          };
        });
        
        console.log(`Property type page title: ${typePageStructure.title}`);
        console.log(`Found ${typePageStructure.forms.length} forms on the property type page`);
        
        // Save property type page structure to a file
        await fs.writeFile(
          path.join(config.outputPath, 'property_type_page_structure.json'), 
          JSON.stringify(typePageStructure, null, 2)
        );
        
        // Try to submit search form if available
        if (typePageStructure.forms.length > 0) {
          console.log('Attempting to submit search form...');
          
          try {
            // Click the first submit button or input
            await Promise.all([
              page.click('button[type="submit"], input[type="submit"]'),
              page.waitForNavigation({ waitUntil: 'networkidle2' })
            ]);
            
            console.log('Successfully submitted search form');
            
            if (config.takeScreenshots) {
              await page.screenshot({ path: path.join(config.outputPath, 'search_results.png') });
            }
            
            // Extract and save the structure of the search results page
            const searchResultsStructure = await page.evaluate(() => {
              return {
                title: document.title,
                url: window.location.href,
                count: document.querySelectorAll('div, article').length,
                propertyItems: [
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
            
            console.log(`Search results page title: ${searchResultsStructure.title}`);
            console.log(`Found ${searchResultsStructure.propertyItems} possible property items`);
            
            // Save search results structure to a file
            await fs.writeFile(
              path.join(config.outputPath, 'search_results_structure.json'), 
              JSON.stringify(searchResultsStructure, null, 2)
            );
          } catch (error) {
            console.error(`Error submitting search form: ${error.message}`);
          }
        }
      }
    }
    
    // ========== ANALYZE SAMPLE PROPERTY LISTINGS ==========
    
    // Try to find direct links to property listings
    console.log('Looking for sample property listings...');
    
    const sampleLinks = await page.evaluate(() => {
      // Keywords that might indicate property listing pages
      const keywords = ['物件', 'property', 'detail', '詳細'];
      
      return Array.from(document.querySelectorAll('a')).filter(a => 
        keywords.some(keyword => a.href.includes(keyword))
      ).slice(0, 5).map(a => ({
        href: a.href,
        text: a.textContent.trim()
      }));
    });
    
    console.log(`Found ${sampleLinks.length} possible property listing links`);
    
    if (sampleLinks.length > 0) {
      // Save sample links to a file
      await fs.writeFile(
        path.join(config.outputPath, 'sample_property_links.json'), 
        JSON.stringify(sampleLinks, null, 2)
      );
      
      // Visit the first sample property page
      const sampleUrl = sampleLinks[0].href;
      console.log(`Visiting sample property page: ${sampleUrl}`);
      
      try {
        await page.goto(sampleUrl, { waitUntil: 'networkidle2' });
        
        if (config.takeScreenshots) {
          await page.screenshot({ path: path.join(config.outputPath, 'sample_property.png') });
        }
        
        // Extract and save the structure of the sample property page
        const propertyPageStructure = await page.evaluate(() => {
          return {
            title: document.title,
            url: window.location.href,
            headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent.trim()),
            details: Array.from(document.querySelectorAll('table tr')).map(tr => ({
              label: tr.querySelector('th') ? tr.querySelector('th').textContent.trim() : '',
              value: tr.querySelector('td') ? tr.querySelector('td').textContent.trim() : ''
            }))
          };
        });
        
        console.log(`Sample property page title: ${propertyPageStructure.title}`);
        
        // Save property page structure to a file
        await fs.writeFile(
          path.join(config.outputPath, 'sample_property_structure.json'), 
          JSON.stringify(propertyPageStructure, null, 2)
        );
      } catch (error) {
        console.error(`Error visiting sample property page: ${error.message}`);
      }
    }
    
    // Final report
    console.log('\nSite analysis completed.');
    console.log(`All results have been saved to ${config.outputPath}`);
    console.log('Review the saved files to understand the website structure');
    
  } catch (error) {
    console.error(`An error occurred during analysis: ${error.message}`);
  } finally {
    await browser.close();
    console.log('Browser closed. Analysis finished.');
  }
}

// Run the analysis
analyzeSite();

module.exports = { analyzeSite };