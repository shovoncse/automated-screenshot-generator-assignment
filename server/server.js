const express = require('express');
const cors = require('cors');
const screenshotmachine = require('screenshotmachine');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const customerKey = process.env.CUSTOMER_KEY;
const secretPhrase = process.env.SECRET_PHRASE || '';

app.post('/screenshots', async (req, res) => {
  const websites = req.body.websites;

  if (!websites || !Array.isArray(websites)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const timestamp = Date.now().toString(36);
  const folderPath = path.join(__dirname, `saved_ss/${timestamp}`);
  
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const screenshotPromises = websites.map((website) => {
    return new Promise((resolve, reject) => {
      const options = {
        url: website.url,
        dimension: '1366xfull',
        device: 'desktop',
        format: 'jpg',
        cacheLimit: '0',
        delay: '200',
        zoom: '100'
      };

      const apiUrl = screenshotmachine.generateScreenshotApiUrl(customerKey, secretPhrase, options);
      const fileName = `${website.id}_${website.name}.jpg`;
      const outputFile = path.join(folderPath, fileName);

      screenshotmachine.readScreenshot(apiUrl).pipe(fs.createWriteStream(outputFile)
        .on('close', () => {
          resolve({ id: website.id, name: website.name, imagePath: `/saved_ss/${timestamp}/${fileName}` });
        })
        .on('error', (err) => {
          reject(err);
        })
      );
    });
  });

  try {
    const screenshots = await Promise.all(screenshotPromises);
    res.json(screenshots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate screenshots' });
  }
});

// Serve static files
app.use('/screenshots', express.static(path.join(__dirname, 'saved_ss')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});