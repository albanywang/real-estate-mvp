/**
 * Simple connectivity test for fudousan.or.jp
 * 
 * This script attempts to access the website with different approaches
 * to diagnose connectivity issues.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const config = {
  urls: [
    'https://www.fudousan.or.jp',
    'http://www.fudousan.or.jp',
    'https://fudousan.or.jp',
    'http://fudousan.or.jp'
  ],
  outputPath: './connectivity_test',
  timeout: 60000 // 60 seconds
};

/**
 * Tests HTTP connectivity using Node.js http/https modules
 */
async function testHttpConnectivity() {
  console.log('Testing HTTP connectivity with Node.js http/https modules...');
  
  for (const url of config.urls) {
    console.log(`Testing: ${url}`);
    
    const httpModule = url.startsWith('https') ? https : http;
    
    await new Promise((resolve) => {
      const req = httpModule.get(url, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', async () => {
          console.log(`Response size: ${data.length} bytes`);
          
          // Save the first 2000 characters to a file
          try {
            await fs.mkdir(config.outputPath, { recursive: true });
            const filename = path.join(
              config.outputPath, 
              `${url.replace(/[^a-zA-Z0-9]/g, '_')}_response.txt`
            );
            await fs.writeFile(filename, data.substring(0, 2000));
            console.log(`Saved response preview to ${filename}`);
          } catch (error) {
            console.error(`Error saving response: ${error.message}`);
          }
          
          resolve();
        });
      });
      
      req.on('error', (error) => {
        console.error(`Error with ${url}: ${error.message}`);
        resolve();
      });
      
      req.setTimeout(10000, () => {
        console.error(`Timeout with ${url}`);
        req.destroy();
        resolve();
      });
    });
    
    console.log('---');
  }
}

/**
 * Tests connectivity using Puppeteer
 */
async function testPuppeteerConnectivity() {
  console.log('\nTesting connectivity with Puppeteer...');
  
  // Launch Puppeteer with verbose logging
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--flag-switches-begin',
      '--disable-site-isolation-trials',
      '--flag-switches-end'
    ],
    timeout: config.timeout
  });
  
  try {
    for (const url of config.urls) {
      console.log(`\nTesting: ${url}`);
      
      const page = await browser.newPage();
      
      // Set a longer timeout
      page.setDefaultNavigationTimeout(config.timeout);
      
      // Enable request and response logging
      page.on('request', req => console.log(`Request: ${req.method()} ${req.url()}`));
      page.on('response', res => console.log(`Response: ${res.status()} ${res.url()}`));
      page.on('console', msg => console.log(`Console: ${msg.text()}`));
      
      try {
        // Navigate to the URL with full timeout
        console.log(`Navigating to ${url} with ${config.timeout}ms timeout...`);
        await page.goto(url, { 
          waitUntil: 'networkidle2',
          timeout: config.timeout 
        });
        
        // Take a screenshot
        await fs.mkdir(config.outputPath, { recursive: true });
        const screenshotPath = path.join(
          config.outputPath, 
          `${url.replace(/[^a-zA-Z0-9]/g, '_')}_screenshot.png`
        );
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved screenshot to ${screenshotPath}`);
        
        // Extract page information
        const pageInfo = await page.evaluate(() => ({
          title: document.title,
          url: window.location.href,
          bodyText: document.body?.textContent?.substring(0, 500) || 'No body text',
          linkCount: document.querySelectorAll('a').length,
          formCount: document.querySelectorAll('form').length
        }));
        
        console.log(`Page info: ${JSON.stringify(pageInfo, null, 2)}`);
        
        // Save the HTML
        const html = await page.content();
        const htmlPath = path.join(
          config.outputPath, 
          `${url.replace(/[^a-zA-Z0-9]/g, '_')}_html.txt`
        );
        await fs.writeFile(htmlPath, html.substring(0, 10000)); // Save first 10000 chars
        console.log(`Saved HTML preview to ${htmlPath}`);
      } catch (error) {
        console.error(`Error with ${url}: ${error.message}`);
        
        // Try to take a screenshot anyway, might show an error page
        try {
          const errorScreenshotPath = path.join(
            config.outputPath, 
            `${url.replace(/[^a-zA-Z0-9]/g, '_')}_error_screenshot.png`
          );
          await page.screenshot({ path: errorScreenshotPath });
          console.log(`Saved error screenshot to ${errorScreenshotPath}`);
        } catch (screenshotError) {
          console.error(`Could not take error screenshot: ${screenshotError.message}`);
        }
      }
      
      await page.close();
    }
  } catch (error) {
    console.error(`An error occurred during Puppeteer testing: ${error.message}`);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

/**
 * Tests connectivity using alternative domains
 */
async function testAlternativeDomains() {
  console.log('\nTesting alternative real estate domains in Japan...');
  
  const alternativeDomains = [
    'https://suumo.jp',
    'https://www.homes.co.jp',
    'https://www.athome.co.jp'
  ];
  
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: config.timeout
  });
  
  try {
    for (const url of alternativeDomains) {
      console.log(`\nTesting alternative domain: ${url}`);
      
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(config.timeout);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: config.timeout });
        
        // Take a screenshot
        await fs.mkdir(config.outputPath, { recursive: true });
        const screenshotPath = path.join(
          config.outputPath, 
          `${url.replace(/[^a-zA-Z0-9]/g, '_')}_screenshot.png`
        );
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved screenshot to ${screenshotPath}`);
        
        // Extract basic page info
        const pageInfo = await page.evaluate(() => ({
          title: document.title,
          url: window.location.href
        }));
        
        console.log(`Alternative domain info: ${JSON.stringify(pageInfo, null, 2)}`);
      } catch (error) {
        console.error(`Error with alternative domain ${url}: ${error.message}`);
      }
      
      await page.close();
    }
  } catch (error) {
    console.error(`An error occurred during alternative domain testing: ${error.message}`);
  } finally {
    await browser.close();
    console.log('Alternative domain testing complete.');
  }
}

/**
 * Main function
 */
async function runConnectivityTests() {
  console.log('Starting connectivity tests for fudousan.or.jp...');
  
  try {
    // Create output directory
    await fs.mkdir(config.outputPath, { recursive: true });
    
    // Run HTTP connectivity tests
    await testHttpConnectivity();
    
    // Run Puppeteer connectivity tests
    await testPuppeteerConnectivity();
    
    // Test alternative domains
    await testAlternativeDomains();
    
    console.log('\nConnectivity tests completed.');
    console.log(`Results saved to ${config.outputPath}`);
  } catch (error) {
    console.error(`An error occurred during testing: ${error.message}`);
  }
}

// Run the tests
runConnectivityTests();