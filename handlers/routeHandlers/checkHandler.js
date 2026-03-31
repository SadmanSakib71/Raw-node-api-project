//dependencies
const data = require("../../lib/data");
const { hashing, parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

//module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callBack) => {
  const acceptMethods = ["get", "post", "put", "delete"];
  if (acceptMethods.indexOf(requestProperties.method) > -1) {
    handler_check[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};

const handler_check = {};

//post method
handler_check.post = (requestProperties, callBack) => {};

//get method
handler_check.get = (requestProperties, callBack) => {};

//put method
handler_check.put = (requestProperties, callBack) => {};

//delete method
handler_check.delete = (requestProperties, callBack) => {};

module.exports = handler;
