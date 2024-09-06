# Website Screenshot Application

## Overview

This application is a full-stack project designed to capture screenshots of specified websites and upload them to Google Drive. The project is split into two main parts: the **Frontend** and the **Backend**. The frontend is built with React and handles user interactions, while the backend is powered by Node.js and handles the logic for capturing screenshots and uploading them to Google Drive.

## Features

- **Capture Screenshots**: Capture full-page screenshots of websites.
- **Google Drive Integration**: Automatically upload screenshots to Google Drive and generate shareable links.
- **Responsive UI**: The frontend is designed with responsiveness in mind to ensure a smooth user experience on various devices.
- **Error Handling**: Provides user feedback for network errors and unsuccessful screenshot captures.

## Project Structure

### Frontend

- **Framework**: React (with TypeScript)
- **Main File**: `src/index.tsx`
- **Development Server**: `react-scripts` for running the application locally.

### Backend

- **Framework**: Node.js with Express
- **Main File**: `server.js`
- **Screenshot Service**: `screenshotmachine` for capturing screenshots.
- **Google Drive Service**: Custom integration using the `googleapis` library.

## Installation

### Prerequisites

- Node.js (version 16.x or later)
- npm or yarn
- Google Cloud account for Drive API credentials

### Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/shovoncse/automated-screenshot-generator-assignment.git
cd automated-screenshot-generator-assignment
```

 #### 2. Install Dependencies:
 - Frontend: cd client && npm install
 - Backend: cd ../server && npm install
 
 #### 3. Environment Configuration:
 - Create a .env file in the server directory with the following environment variables:
 - PORT=3001
 - CUSTOMER_KEY=your_screenshotmachine_customer_key
 - SECRET_PHRASE=your_screenshotmachine_secret_phrase
 - GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id
 - GOOGLE_DRIVE_CLIENT_SECRET=your_google_drive_client_secret
 - GOOGLE_DRIVE_REDIRECT_URI=your_google_drive_redirect_uri
 - GOOGLE_DRIVE_REFRESH_TOKEN=your_google_drive_refresh_token
 - GOOGLE_DRIVE_PARENT_FOLDER_ID=your_google_drive_parent_folder_id
 #### 4. Start the Development Servers:
 - Frontend: cd client && npm start
 - Backend: cd ../server && npm run dev
  
 #### 5 Testing the Application:
 * - Open your browser and navigate to http://localhost:3000.
 * - Click the "Fetch Screenshots" button to capture screenshots of the predefined websites.
 * - After the screenshots are fetched, they will be displayed on the page.
 * - A link to view all screenshots in Google Drive will also be provided.
 * 
 ### Libraries Used:
 #### Frontend:
 - React: Library for building user interfaces.
 - TypeScript: Superset of JavaScript that adds static typing.
 - React Scripts: Toolchain for running and building React applications.
  
 #### Backend:
 - Express: Web framework for Node.js.
 - cors: Middleware for handling Cross-Origin Resource Sharing.
 - dotenv: Loads environment variables from a .env file.
 - axios: Promise-based HTTP client for making API requests.
 - Google APIs: Client library for Google APIs including Google Drive.
