//dependencies
const data = require("../../lib/data");
const { hashing, parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const { ary } = require("lodash");

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
handler_check.post = (requestProperties, callBack) => {
  //validate inputs
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["get", "post", "put", "delete"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  let successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  let timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;
};

//get method
handler_check.get = (requestProperties, callBack) => {};

//put method
handler_check.put = (requestProperties, callBack) => {};

//delete method
handler_check.delete = (requestProperties, callBack) => {};

module.exports = handler;
