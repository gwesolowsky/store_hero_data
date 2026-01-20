import puppeteer from "puppeteer";
import fs from "fs";

function showLoading() {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const message = 'Fetching listing data';
  let i = 0;
  
  const interval = setInterval(() => {
    process.stdout.write(`\r${frames[i]} ${message}...`);
    i = (i + 1) % frames.length;
  }, 80);
  
  return () => {
    clearInterval(interval);
    process.stdout.write('\r\x1b[K'); // Clear the line
  };
}

async function getDataFromPage(url) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the images to load
  await page.waitForSelector('.packshot-image');
  
  // Select the first 4 images with class "packshot-image" and get their parent link
  const images = await page.$$eval('.packshot-image', imgs => 
    imgs.slice(0, 4).map(img => {
      const parentLink = img.closest('.packshot-list-content');
      return {
        src: img.src,
        alt: img.alt,
        href: parentLink ? parentLink.href : ''
      };
    })
  );
  
  await browser.close();
  return images;
}

function saveToJSON(images) {
  // Helper function to strip query parameters from URL
  const cleanUrl = (url) => url ? url.split('?')[0] : '';
  
  // Helper function to ensure full URL
  const getFullUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://www.skystore.com${url}`;
  };
  
  const data = {
    title1: images[0]?.alt || '',
    image1: cleanUrl(images[0]?.src),
    link1: getFullUrl(images[0]?.href),
    title2: images[1]?.alt || '',
    image2: cleanUrl(images[1]?.src),
    link2: getFullUrl(images[1]?.href),
    title3: images[2]?.alt || '',
    image3: cleanUrl(images[2]?.src),
    link3: getFullUrl(images[2]?.href),
    title4: images[3]?.alt || '',
    image4: cleanUrl(images[3]?.src),
    link4: getFullUrl(images[3]?.href)
  };
  
  console.log(data);
  
  fs.writeFileSync('movies.json', JSON.stringify(data, null, 2));
  console.log('Data saved to movies.json');
}

async function main() {
  const stopLoading = showLoading();
  
  try {
    const images = await getDataFromPage('https://www.skystore.com/n/mvea/movies/new-to-buy');
    stopLoading();
    saveToJSON(images);
  } catch (error) {
    stopLoading();
    console.error('Error:', error.message);
  }
}

main();