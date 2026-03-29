//dependencies
const data = require("../../lib/data");
const {
  hashing,
  parseJSON,
  createRandomString,
} = require("../../helpers/utilities");

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
handler_token.post = (requestProperties, callBack) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length > 0
      ? requestProperties.body.phone
      : null;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : null;

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      let hashedPassword = hashing(password);
      if (hashedPassword === userData.password) {
        let tokenId = createRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          tokenId,
          expires,
        };
      } else {
        callBack(400, {
          error: "Password is not valid",
        });
      }
    });
  } else {
    callBack(400, {
      error: "You have a problem on your request",
    });
  }
};

//get method
handler_token.get = (requestProperties, callBack) => {};

//put method
handler_token.put = (requestProperties, callBack) => {};

//delete method
handler_token.delete = (requestProperties, callBack) => {};

module.exports = handler;
