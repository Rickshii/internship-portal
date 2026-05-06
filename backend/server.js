const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage configuration for screenshot upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Google Sheets API Setup
// Provide credentials in credentials.json and spreadsheet ID in .env
// Example .env: SPREADSHEET_ID=your_spreadsheet_id_here
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // Path to your Google Cloud service account JSON
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function appendToSheet(data) {
  try {
    // If no credentials file is present, just log and return success
    if (!fs.existsSync(path.join(__dirname, 'credentials.json'))) {
      console.log('No credentials.json found. Mocking Google Sheets append:');
      console.log(data);
      return true;
    }

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Assuming the sheet name is 'Sheet1' and columns are:
    // Timestamp | Name | Email | Phone | College | Branch | Year | Skills | Transaction ID | Screenshot URL
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: 'Sheet1!A:J',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data],
      },
    });
    return true;
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    return false;
  }
}

app.post('/api/register', upload.single('screenshot'), async (req, res) => {
  try {
    const { name, email, phone, college, branch, year, skills, transactionId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Payment screenshot is required.' });
    }

    const screenshotUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const timestamp = new Date().toLocaleString();

    const sheetData = [
      timestamp,
      name,
      email,
      phone,
      college,
      branch,
      year,
      skills,
      transactionId,
      screenshotUrl
    ];

    const isSuccess = await appendToSheet(sheetData);

    if (isSuccess) {
      res.status(200).json({ message: 'Registration successful!', data: sheetData });
    } else {
      res.status(500).json({ message: 'Failed to save to Google Sheets.' });
    }

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
