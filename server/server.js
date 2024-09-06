// server.js
const express = require('express');
const cors = require('cors');
const screenshotmachine = require('screenshotmachine');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { GoogleDriveService } = require('./googleDriveService');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const customerKey = process.env.CUSTOMER_KEY;
const secretPhrase = process.env.SECRET_PHRASE || '';
const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || '';
const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';
const permanentParentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID || '';  // Add your permanent folder ID here

const googleDriveService = new GoogleDriveService(driveClientId, driveClientSecret, driveRedirectUri, driveRefreshToken);

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
          resolve({ id: website.id, name: website.name, filePath: outputFile });
        })
        .on('error', (err) => {
          reject(err);
        })
      );
    });
  });

  try {
    const screenshots = await Promise.all(screenshotPromises);

    // Create a new subfolder within the permanent parent folder
    const driveFolder = await googleDriveService.createFolder(`Screenshots_${timestamp}`, permanentParentFolderId);

    const uploadPromises = screenshots.map(async (screenshot) => {
      const uploadedFile = await googleDriveService.saveFile(screenshot.name, screenshot.filePath, 'image/jpeg', driveFolder.id);
      return {
        id: screenshot.id,
        name: screenshot.name,
        imagePath: `https://drive.google.com/uc?id=${uploadedFile.data.id}&export=view`,
      };
    });

    const uploadedScreenshots = await Promise.all(uploadPromises);

    // Clean up local files
    fs.rmSync(folderPath, { recursive: true, force: true });

    // Return the public link to the Drive subfolder
    res.json({
      screenshots: uploadedScreenshots,
      folderLink: `https://drive.google.com/drive/folders/${driveFolder.data.id}?usp=sharing`
    });
  } catch (err) {
    console.error('Error generating and uploading screenshots:', err);
    res.status(500).json({ error: 'Failed to generate and upload screenshots' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
