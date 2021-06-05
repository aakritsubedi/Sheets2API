const program = require("commander");

const getSheetData = require("../components/sheets");

program.version("1.0.0").description("Google Sheets to API");

program
  .command("add-sheets")
  .requiredOption("--url <url>", "URL of the google sheet")
  .option("--identifier <identifier>", "API Endpoint Identifier")
  .description("Add Sheets to serve as API")
  .action(async (program) => {
    const { url, identifier } = program;

    const data = await getSheetData(url, identifier, "json");

    console.log(data);
  });

program.parse();
