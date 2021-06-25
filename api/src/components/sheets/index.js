const os = require("os");
const axios = require("axios");
const { google } = require("googleapis");

const arrayJSON = require("../../utils/arrayToJson");

const getDownloadLink = async (url) => {
  console.log(url.includes("https://docs.google.com/spreadsheets/d/"));
  if (!url.includes("https://docs.google.com/spreadsheets/d/")) {
    return "Invalid URL";
  }

  const key = url.match(/(?=\/d\/).*/)[0].split("/")[2];
  const gid = url.match(/(?=gid).*/)[0].split("=")[1];

  const downloadLink = `https://docs.google.com/spreadsheets/d/${key}/export?format=csv&gid=${gid}`;

  return downloadLink;
};

const getCSV = async (downloadLink) => {
  const csv = await axios.get(downloadLink);

  return csv.data;
};

const getSheetData = async (key, gid) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  // Create a client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  // Get a metadata about Sheets
  const metadata = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: key,
  });

  let sheetName;
  const sheetsInfo = metadata.data.sheets.find(
    (sheet) => Number(sheet.properties.sheetId) == gid
  );

  if (Object.keys(sheetsInfo).length) {
    sheetName = sheetsInfo.properties.title;
  }

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: key,
    range: sheetName,
  });

  const values = getRows.data.values;
  const jsonData = arrayJSON(values);

  return jsonData;
};

const getSheetsInfo = async (key) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  // Create a client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  // Get a metadata about Sheets
  const metadata = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: key,
  });

  const allData = {};
  for await (sheet of metadata.data.sheets) {
    let sheetName = sheet.properties.title;
    let gid = sheet.properties.sheetId;
    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: key,
      range: sheetName,
    });
    const values = getRows.data.values;
    const jsonData = await arrayJSON(values);

    allData[`${sheetName}-${gid}`] = JSON.parse(jsonData);
  }

  return allData;
};

const addSheetData = async (key, gid, data) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  // Create a client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  // Get a metadata about Sheets
  const metadata = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: key,
  });

  let sheetName;
  const sheetsInfo = metadata.data.sheets.find(
    (sheet) => Number(sheet.properties.sheetId) == gid
  );

  if (Object.keys(sheetsInfo).length) {
    sheetName = sheetsInfo.properties.title;
  }

  // Write Rows(s) to the Spreadsheets
  const info = await googleSheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: key,
    range: sheetName,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [Object.values(data)],
    },
  });

  return info;
};

module.exports = { getSheetData, addSheetData, getSheetsInfo };
