const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function downloadImages(baseUrl, startNumber, name, target) {
  // Create target directory if it doesn't exist
  try {
    await fs.mkdir(target, { recursive: true });
    console.log(`Created/using target directory: ${target}`);
  } catch (err) {
    console.error(`Error creating directory: ${err.message}`);
    return 0;
  }

  let count = 0;
  const maxImages = 5;

  for (let i = 0; i < maxImages; i++) {
    const imageNumber = parseInt(startNumber) + i;
    const imgUrl = baseUrl.replace(/(\d+)_pcViewLargerHeight\.jpg$/, `${imageNumber}_pcViewLargerHeight.jpg`);
    console.log(`Attempting to download: ${imgUrl}`);

    try {
      // Get file extension (force .jpg as per pattern)
      const fileExtension = '.jpg';
      const filePath = path.join(target, `${name}-${count + 1}${fileExtension}`);

      // Download image
      const response = await axios.get(imgUrl, { 
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      await fs.writeFile(filePath, response.data);
      console.log(`Downloaded: ${filePath}`);
      count++;
    } catch (err) {
      console.error(`Error downloading ${imgUrl}: ${err.message}`);
      continue;
    }
  }

  console.log(`Total images attempted: ${maxImages}, Successfully downloaded: ${count}`);
  return count;
}

// Main execution
(async () => {
  const args = process.argv.slice(2);
  if (args.length !== 4) {
    console.error('Usage: node download_images.js <base_url> <start_number> <name> <target_directory>');
    process.exit(1);
  }

  const [baseUrl, startNumber, name, target] = args;
  const downloaded = await downloadImages(baseUrl, startNumber, name, target);
  console.log(`Successfully downloaded ${downloaded} images`);
})();

// node download_images.js https://img2-direct.miraie-net.com/orgt/20015_21950/13/984032/373281051_pcViewLargerHeight.jpg 373281051 id75 C:\Users\lwang\Desktop\real-estate-mvp\server\public\images