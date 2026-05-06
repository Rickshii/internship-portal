# Full-Stack Internship Registration System

This project contains a beautiful, responsive frontend and a backend server to handle registration form submissions, including payment screenshot uploads and Google Sheets integration.

## Project Structure

- `frontend/`: A Vite + React application. Features a dynamic glassmorphic design and a form for all applicant details and payment verification.
- `backend/`: An Express + Node.js server. Handles `multipart/form-data` for file uploads using Multer and contains logic for appending data directly to a Google Sheet.

## Getting Started

### 1. Start the Backend Server
First, open a terminal and navigate to the backend directory, then start the server.
```bash
cd backend
npm install
npm run start # or node server.js
```
The server will run on `http://localhost:5000`. It will create an `uploads/` directory automatically when a screenshot is uploaded.

### 2. Start the Frontend
Open a new terminal and navigate to the frontend directory.
```bash
cd frontend
npm install
npm run dev
```
The application will be running at `http://localhost:5173`.

## Google Sheets Integration Setup

The backend is pre-configured to write data to Google Sheets, but you must provide your Google Cloud credentials.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the **Google Sheets API**.
4. Go to **Credentials** -> **Create Credentials** -> **Service Account**.
5. Create a service account and generate a JSON key for it.
6. Rename the downloaded JSON file to `credentials.json` and place it inside the `backend/` folder (`r:\internship\backend\credentials.json`).
7. Open your target Google Sheet. **Share the sheet with the Service Account email address** (found in `credentials.json`) and give it **Editor** access.
8. Create a `.env` file in the `backend/` directory and add your Spreadsheet ID (found in the Google Sheets URL):
   ```env
   SPREADSHEET_ID=your_spreadsheet_id_here
   ```
9. The backend will now automatically push form submissions to your Google Sheet! If `credentials.json` is missing, the backend will still function but will mock the database by logging the entry to the server console.
