//dependencies
const data = require("../../lib/data");
// const { hashing, parseJSON } = require("../../helpers/utilities");

//module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callBack) => {
  const acceptMethods = ["get", "post", "put", "delete"];
  if (acceptMethods.indexOf(requestProperties.method) > -1) {
    handler_token[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};

const handler_token = {};

//post method
handler_token.post = (requestProperties, callBack) => {};

//get method
handler_token.get = (requestProperties, callBack) => {};

//put method
handler_token.put = (requestProperties, callBack) => {};

//delete method
handler_token.delete = (requestProperties, callBack) => {};

module.exports = handler;
