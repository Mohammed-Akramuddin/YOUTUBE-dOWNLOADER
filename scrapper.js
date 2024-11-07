const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape a website's content
async function scrapeWebsite(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract all paragraphs from the website
    let content = '';
    $('p').each((_, element) => {
      content += $(element).text() + ' ';
    });

    return content;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Failed to scrape website.');
  }
}

module.exports = { scrapeWebsite };
