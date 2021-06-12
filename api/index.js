const cors = require("cors");
const path = require("path");
const express = require("express");

const {
  getSheetData,
  getLogs,
  addSheetData,
} = require("./src/components/sheets");

const app = express();

app.use(cors());
app.use(express.json());

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
    methods: [
      {
        title: "GET",
        description: "Get all the data from sheet",
        url: `${baseUrl}/sheet2api?key=${key}&gid=${gid}`,
      },
      {
        title: "POST",
        description: "Add the data to sheet",
        url: `${baseUrl}/sheet2api?key=${key}&gid=${gid}`,
        body: {
          format: 'JSON',
          keys: Object.keys(data[0]),
          example: data[0]
        }
      },
    ],
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
    message: logs.length ? "Access Logs" : "Unauthorized Access",
  });
});

app.post("/sheets2api", async (req, res) => {
  const key = req.query.key;
  const gid = req.query.gid;
  const data = req.body;

  try {
    await addSheetData(key, gid, data);
    res.status(200).json({
      code: 200,
      status: "SUCCESS",
      message: "Data add successfully.",
    });
  } catch (err) {
    const { status, code, message } = err.response.data.error;
    res.status(code).json({
      code: code,
      status: status,
      errors: [
        message,
        "Add sheets2api@sheets2api.iam.gserviceaccount.com to sheets as editor.",
      ],
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
