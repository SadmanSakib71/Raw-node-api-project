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
      if (hashedPassword === parseJSON(userData).password) {
        let tokenId = createRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          tokenId,
          expires,
        };

        //create token
        data.create("tokens", tokenId, tokenObject, (err) => {
          if (!err) {
            callBack(200, tokenObject);
          } else {
            callBack(500, {
              error: "There is a problem in server side",
            });
          }
        });
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
handler_token.get = (requestProperties, callBack) => {
  const tokenId =
    typeof requestProperties.queryStringObject.tokenId === "string" &&
    requestProperties.queryStringObject.tokenId.trim().length === 20
      ? requestProperties.queryStringObject.tokenId
      : null;
  if (tokenId) {
    data.read("tokens", tokenId, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      if (!err && token) {
        callBack(200, token);
      } else {
        callBack(404, {
          error: "Requested token was not found 2",
        });
      }
    });
  } else {
    callBack(404, {
      error: "Requested token was not found",
    });
  }
};

//put method
handler_token.put = (requestProperties, callBack) => {
  const tokenId =
    typeof requestProperties.body.tokenId === "string" &&
    requestProperties.body.tokenId.trim().length === 20
      ? requestProperties.body.tokenId
      : null;
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? true
      : false;

  if (tokenId && extend) {
    data.read("tokens", tokenId, (err, tokenData) => {
      const tokenObject = parseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;
        data.update("tokens", tokenId, tokenObject, (err) => {
          if (!err) {
            callBack(200, {
              message: "expires update successfully",
            });
          } else {
            callBack(500, {
              error: "server side problem",
            });
          }
        });
      } else {
        callBack(400, {
          error: "token already expired",
        });
      }
    });
  } else {
    callBack(400, {
      error: "there was problem in your request",
    });
  }
};

//delete method
handler_token.delete = (requestProperties, callBack) => {
  const tokenId =
    typeof requestProperties.queryStringObject.tokenId === "string" &&
    requestProperties.queryStringObject.tokenId.trim().length === 20
      ? requestProperties.queryStringObject.tokenId
      : null;

  if (tokenId) {
    data.read("tokens", tokenId, (err, userData) => {
      if (!err && userData) {
        data.delete("tokens", tokenId, (err) => {
          if (!err) {
            callBack(200, {
              message: "token was successfully deleted",
            });
          } else {
            callBack(500, {
              error: "server side problem ",
            });
          }
        });
      } else {
        callBack(404, {
          error: "Requested token was not found",
        });
      }
    });
  } else {
    callBack(400, {
      error: "token is not valid",
    });
  }
};

module.exports = handler;
