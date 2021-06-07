var cors = require("cors");
const path = require("path");
const express = require("express");

const { getSheetData, getLogs } = require("./src/components/sheets");

const app = express();

app.use(cors());

const baseUrl = "https://sheets2api.aakritsubedi9.com.np";

app.route("/").get(async (req, res) => {
  res.json({
    name: "sheets2API",
    description: "Google Sheets to API",
    developedBy: "AAkrit Subedi",
    version: "v1.0.0",
  });
});

app.get("/apiInfo", async (req, res) => {
  const key = req.query.key;
  const gid = req.query.gid;
  const url = `https://docs.google.com/spreadsheets/d/${key}/edit#gid=${gid}`;
  const identifier = "null";

  let data = await getSheetData(url, identifier, "json", "web-client");
  data = JSON.parse(data);
  res.json({
    status: 1,
    apiURL: `${baseUrl}/sheet2api?key=${key}&gid=${gid}`,
    data: data,
  });
});

app.get("/sheet2api", async (req, res) => {
  const key = req.query.key;
  const gid = req.query.gid;
  const url = `https://docs.google.com/spreadsheets/d/${key}/edit#gid=${gid}`;
  const identifier = "null";

  let data = await getSheetData(url, identifier, "json", "api");
  data = JSON.parse(data);
  res.json({
    data,
  });
});

app.get("/logs", async (req, res) => {
  const password = req.query.password;
  const logs = getLogs(password);

  res.json({
    counter: logs.length,
    logs: logs,
    message: logs.length ? 'Access Logs' : 'Unauthorized Access'
  });
});

app.listen(5000);
