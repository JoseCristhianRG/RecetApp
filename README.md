# RecetApp

A simple React application showcasing recipe categories and detail pages using React Router.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm start
   ```

## Firebase Configuration

To enable authentication and use Firestore as the database, set up environment variables:

1. Create a `.env` file in the project root with the following (replace with your Firebase project values):
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```
2. Restart the development server if it was already running.

The app will be available at http://localhost:3000.