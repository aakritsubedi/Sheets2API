const os = require("os");
const axios = require("axios");

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

const getLogs = (password) => {
  if(password === getFileContent("./src/logs/password")) {
    let logs = getFileContent("./src/logs/logs");
    logs = JSON.parse(csvJSON(logs));
  
    return logs;
  }

  return [];
};

module.exports = { getLogs, getSheetData };
