
const bodyParser = require('body-parser');
const cors = require('cors');
const { scrapeWebsite } = require('./scrapper');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5002; // Change the port here

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Predefined URLs (add as many as you want here)
const urls = [
  'https://sru.edu.in/', // Replace with actual URL 1
  'https://sru.edu.in/minors_honourstps://example2.com', // Replace with actual URL 2
  'https://sru.edu.in/placements-drive', // Replace with actual URL 3
  'https://sru.edu.in/placement'
  // Add more URLs as needed
];

let scrapedData = {};

// Scrape websites on startup
(async () => {
  for (const url of urls) {
    try {
      scrapedData[url] = await scrapeWebsite(url);
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
    }
  }
})();

// API to handle chatbot queries
app.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Please provide a question.' });
  }

  try {
    let foundAnswer = false;
    let answer = "Sorry, I couldn't find any relevant information.";

    // Simple keyword matching logic
    for (const url in scrapedData) {
      const lowerCaseContent = scrapedData[url].toLowerCase();
      const lowerCaseQuestion = question.toLowerCase();

      if (lowerCaseContent.includes(lowerCaseQuestion)) {
        foundAnswer = true;
        answer = `I found relevant information on ${url}!`;
        break;
      }
    }

    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Error processing your question.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
