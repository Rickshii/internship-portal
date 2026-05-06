const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function testSheet() {
  try {
    console.log('Checking credentials.json...');
    if (!fs.existsSync(path.join(__dirname, 'credentials.json'))) {
      console.log('Error: credentials.json is missing.');
      return;
    }

    console.log('Credentials found. Authenticating...');
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    if (!spreadsheetId) {
      console.log('Error: SPREADSHEET_ID is not defined in .env');
      return;
    }

    console.log('Spreadsheet ID:', spreadsheetId);
    console.log('Attempting to fetch spreadsheet metadata...');
    
    // Test fetching spreadsheet info to see if we have access and what the sheet name is
    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });
    
    console.log('Successfully fetched metadata!');
    console.log('Available sheets:', metaData.data.sheets.map(s => s.properties.title).join(', '));
    
    const firstSheetName = metaData.data.sheets[0].properties.title;
    console.log(`Attempting to append to '${firstSheetName}'...`);

    const data = ['Test', 'Data', new Date().toLocaleString()];

    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: `${firstSheetName}!A:C`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data],
      },
    });

    console.log('Successfully appended test data!');
  } catch (error) {
    console.error('\n--- GOOGLE SHEETS API ERROR ---');
    console.error(error.message);
    if (error.response && error.response.data) {
      console.error(error.response.data);
    }
    console.error('-------------------------------\n');
  }
}

testSheet();
