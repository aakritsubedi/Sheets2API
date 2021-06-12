const arrayJSON = async (data) => {
  const arrayData = data;
  let headers = arrayData[0];
  let lines =  arrayData.slice(1, arrayData.length);
  let result = [];

  for await (line of lines) {
    let obj = {};
    for(let i=0; i<headers.length; i++) {
      obj[headers[i]] = line[i]
    }

    result.push(obj);
  }

  return JSON.stringify(result);
};

module.exports = arrayJSON;
