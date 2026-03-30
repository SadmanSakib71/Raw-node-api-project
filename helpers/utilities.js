//dependencies
const crypto = require("node:crypto");
const environments = require("./environments");

//module object - scaffolding
const utilities = {};

//parse JSON string to object
utilities.parseJSON = (stringJSON) => {
  let output;
  try {
    output = JSON.parse(stringJSON);
  } catch {
    output = {};
  }
  return output;
};

//Hashing with crypto
utilities.hashing = (string) => {
  if (typeof string === "string" && string.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(string)
      .digest("hex");

    return hash;
  } else {
    return false;
  }
};

//create random string
utilities.createRandomString = (stringLength) => {
  let length = stringLength;
  length =
    typeof stringLength === "number" && stringLength > 0 ? stringLength : false;
  if (length) {
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let output = "";
    for (let i = 1; i <= length; i++) {
      const randomChart = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length),
      );
      output += randomChart;
    }
    return output;
  }
  return false;
};

module.exports = utilities;
