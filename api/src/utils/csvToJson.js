const csvJSON = (csv) => {
  let lines = csv.split("\n");

  let result = [];

  let headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    let obj = {};
    let currentLine = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j];
    }

    result.push(obj);
  }

  return JSON.stringify(result);
};

module.exports = csvJSON;
