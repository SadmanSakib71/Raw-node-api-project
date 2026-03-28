//module object - scaffolding
const utilities = {};

utilities.parseJSON = (stringJSON) => {
  let output;
  try {
    output = JSON.parse(stringJSON);
  } catch {
    output = {};
  }
  return output;
};

module.exports = utilities;
