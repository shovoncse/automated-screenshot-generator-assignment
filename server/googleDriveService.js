const fs = require('fs');
const { google } = require('googleapis');

class GoogleDriveService {
  constructor(clientId, clientSecret, redirectUri, refreshToken) {
    this.driveClient = this.createDriveClient(clientId, clientSecret, redirectUri, refreshToken);
  }

  createDriveClient(clientId, clientSecret, redirectUri, refreshToken) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    client.setCredentials({ refresh_token: refreshToken });
    return google.drive({
      version: 'v3',
      auth: client,
    });
  }

  async createFolder(folderName, parentFolderId = null) {
    const resource = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentFolderId) {
      resource.parents = [parentFolderId];
    }

    try {
      const folder = await this.driveClient.files.create({
        resource,
        fields: 'id, name',
      });
      return folder.data; // Returns the folder's ID and name
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  async searchFolder(folderName) {
    try {
      const res = await this.driveClient.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
        fields: 'files(id, name)',
      });

      return res.data.files.length ? res.data.files[0] : null;
    } catch (error) {
      console.error('Error searching folder:', error);
      throw error;
    }
  }

  async saveFile(fileName, filePath, fileMimeType, folderId = null) {
    try {
      const fileMetadata = {
        name: fileName,
        mimeType: fileMimeType,
      };

      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      const media = {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      };

      const file = await this.driveClient.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, name',
      });

      // Make the file public
      await this.driveClient.permissions.create({
        fileId: file.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return file;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }
}

module.exports = { GoogleDriveService };