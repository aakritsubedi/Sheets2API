const axios = require("axios");

const csvJSON = require("../../utils/csvToJson");

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

const getSheetData = async (url, identifier, format) => {
  const downloadLink = await getDownloadLink(url);
  console.log(downloadLink);
  const csv = await getCSV(downloadLink);
  if (format === "csv") {
    return csv;
  } else if (format === "json") {
    return csvJSON(csv);
  }
};

module.exports = getSheetData;
