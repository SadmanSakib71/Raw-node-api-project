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
      .createHmac("sha256", environments[process.env.NODE_ENV].secretKey)
      .update(string)
      .digest("hex");

    return hash;
  } else {
    return false;
  }
};

module.exports = utilities;
