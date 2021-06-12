const os = require("os");
const axios = require("axios");
const { google } = require("googleapis");

const csvJSON = require("../../utils/csvToJson");
const {
  appendFileContent,
  getFileContent,
} = require("../../utils/fileHandling");

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

const getSheetData = async (url, identifier, format, source) => {
  const info =
    `${url}, ${identifier}, ${format}, ${new Date()}, ${source}` + os.EOL;
  appendFileContent("./src/logs/logs", info);

  const downloadLink = await getDownloadLink(url);
  const csv = await getCSV(downloadLink);

  if (format === "csv") {
    return csv;
  } else if (format === "json") {
    return csvJSON(csv);
  }
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

const getLogs = (password) => {
  if (password === getFileContent("./src/logs/password")) {
    let logs = getFileContent("./src/logs/logs");
    logs = JSON.parse(csvJSON(logs));

    return logs;
  }

  return [];
};

module.exports = { getLogs, getSheetData, addSheetData };
