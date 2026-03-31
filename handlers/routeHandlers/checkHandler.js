//dependencies
const data = require("../../lib/data");
const {
  hashing,
  parseJSON,
  createRandomString,
} = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const { maximumCheck } = require("../../helpers/environments");

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
  // validate inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    const token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    // lookup the user phone by reading the token
    data.read("tokens", token, (err1, tokenData) => {
      if (!err1 && tokenData) {
        const phone = parseJSON(tokenData).phone;
        // lookup the user data
        data.read("users", phone, (err2, userData) => {
          if (!err2 && userData) {
            tokenHandler._token.verify(token, phone, (tokenIsValid) => {
              if (tokenIsValid) {
                const userObject = parseJSON(userData);
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < maximumCheck) {
                  const checkId = createRandomString(20);
                  const checkObject = {
                    checkId,
                    phone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };
                  // save the object
                  data.create("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      // add check id to the user's object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      // save the new user data
                      data.update("users", phone, userObject, (err4) => {
                        if (!err4) {
                          // return the data about the new check
                          callBack(200, checkObject);
                        } else {
                          callBack(500, {
                            error: "There was a problem in the server side!",
                          });
                        }
                      });
                    } else {
                      callBack(500, {
                        error: "There was a problem in the server side!",
                      });
                    }
                  });
                } else {
                  callBack(401, {
                    error: "User has already reached max check limit!",
                  });
                }
              } else {
                callBack(403, {
                  error: "Authentication problem!",
                });
              }
            });
          } else {
            callBack(403, {
              error: "User not found!",
            });
          }
        });
      } else {
        callBack(403, {
          error: "Authentication problem!",
        });
      }
    });
  } else {
    callBack(400, {
      error: "You have a problem in your request",
    });
  }
};

//get method
handler_check.get = (requestProperties, callBack) => {
  const checkId =
    typeof requestProperties.queryStringObject.checkId === "string" &&
    requestProperties.queryStringObject.checkId.trim().length === 20
      ? requestProperties.queryStringObject.checkId
      : false;

  if (checkId) {
    data.read("checks", checkId, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof requestProperties.headerObject.token === "string"
            ? requestProperties.headerObject.token
            : false;

        tokenHandler._token.verify(
          token,
          parseJSON(checkData).phone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              callBack(200, parseJSON(checkData));
            } else {
              callBack(403, {
                error: "Authentication error",
              });
            }
          },
        );
      } else {
        callBack(500, {
          error: "Data not found in the server",
        });
      }
    });
  } else {
    callBack(400, {
      error: "You have problem in your request",
    });
  }
};

//put method
handler_check.put = (requestProperties, callBack) => {
  const checkId =
    typeof requestProperties.body.checkId === "string" &&
    requestProperties.body.checkId.trim().length === 20
      ? requestProperties.body.checkId
      : false;

  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (checkId) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      data.read("checks", checkId, (err, checkData) => {
        if (!err && checkData) {
          const checkObject = parseJSON(checkData);
          const token =
            typeof requestProperties.headerObject.token === "string"
              ? requestProperties.headerObject.token
              : false;

          tokenHandler._token.verify(
            token,
            checkObject.phone,
            (tokenIsValid) => {
              if (tokenIsValid) {
                protocol && (checkObject.protocol = protocol);
                url && (checkObject.url = url);
                method && (checkObject.method = method);
                successCodes && (checkObject.successCodes = successCodes);
                timeoutSeconds && (checkObject.timeoutSeconds = timeoutSeconds);

                //store the check object
                data.update("checks", checkId, checkObject, (err) => {
                  if (!err) {
                    callBack(200);
                  } else {
                    callBack(500, {
                      error: "there is a problem to update the data",
                    });
                  }
                });
              } else {
                callBack(403, {
                  error: "Authentication error",
                });
              }
            },
          );
        } else {
          callBack(500, {
            error: "Data not found in the server",
          });
        }
      });
    } else {
      callBack(400, {
        error: "You must provide at least one field",
      });
    }
  } else {
    callBack(400, {
      error: "you have a problem on your request",
    });
  }
};

//delete method
handler_check.delete = (requestProperties, callBack) => {
  const checkId =
    typeof requestProperties.queryStringObject.checkId === "string" &&
    requestProperties.queryStringObject.checkId.trim().length === 20
      ? requestProperties.queryStringObject.checkId
      : false;

  if (checkId) {
    data.read("checks", checkId, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof requestProperties.headerObject.token === "string"
            ? requestProperties.headerObject.token
            : false;

        tokenHandler._token.verify(
          token,
          parseJSON(checkData).phone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              data.delete("checks", checkId, (err) => {
                if (!err) {
                  data.read(
                    "users",
                    parseJSON(checkData).phone,
                    (err, userData) => {
                      const userObject = parseJSON(userData);
                      if (!err && userData) {
                        const userChecks =
                          typeof userObject.checks === "object" &&
                          userObject.checks instanceof Array
                            ? userObject.checks
                            : [];
                        //remove the deleted check id from the user's list of checks
                        const checkPosition = userChecks.indexOf(checkId);
                        if (checkPosition > -1) {
                          userChecks.splice(checkPosition, 1);
                          //resave the user data
                          userObject.checks = userChecks;
                          data.update(
                            "users",
                            userObject.phone,
                            userObject,
                            (err) => {
                              if (!err) {
                                callBack(200, {
                                  message: "successfully update users check",
                                });
                              } else {
                                callBack(500, {
                                  error:
                                    "server side problem can't update user's checks",
                                });
                              }
                            },
                          );
                        } else {
                          callBack(500, {
                            error:
                              "the check id is not found that you wanna try to remove",
                          });
                        }
                      } else {
                        callBack(500, {
                          error: "No data found for this user",
                        });
                      }
                    },
                  );
                } else {
                  callBack(500, {
                    error: "server side problem can't delete",
                  });
                }
              });
            } else {
              callBack(403, {
                error: "Authentication error",
              });
            }
          },
        );
      } else {
        callBack(500, {
          error: "Data not found in the server for delete",
        });
      }
    });
  } else {
    callBack(400, {
      error: "You have problem in your request",
    });
  }
};

module.exports = handler;
