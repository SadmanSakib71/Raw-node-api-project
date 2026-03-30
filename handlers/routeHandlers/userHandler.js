//dependencies
const data = require("../../lib/data");
const { hashing, parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("../routeHandlers/tokenHandler");

//module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callBack) => {
  const acceptMethods = ["get", "post", "put", "delete"];
  if (acceptMethods.indexOf(requestProperties.method) > -1) {
    handler_users[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405);
  }
};

const handler_users = {};

//post method
handler_users.post = (requestProperties, callBack) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : null;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : null;

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

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement === true
      ? requestProperties.body.tosAgreement
      : null;

  if (firstName && lastName && phone && password && tosAgreement) {
    //make sure user doesn't already exist
    data.read("users", phone, (err) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hashing(password),
          tosAgreement,
        };

        //store the user to Db
        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callBack(200, { message: "Create user successfully" });
          } else {
            callBack(500, {
              error: "could not create user",
            });
          }
        });
      } else {
        callBack(500, {
          error: "there was a problem in server side",
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
handler_users.get = (requestProperties, callBack) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length > 0
      ? requestProperties.queryStringObject.phone
      : null;
  if (phone) {
    data.read("users", phone, (err, data) => {
      const userData = { ...parseJSON(data) };
      if (!err && userData) {
        delete userData.password;
        callBack(200, userData);
      } else {
        callBack(404, {
          error: "Requested user was not found",
        });
      }
    });
  } else {
    callBack(404, {
      error: "Requested user was not found",
    });
  }
};

//put method
handler_users.put = (requestProperties, callBack) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : null;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : null;

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
  if (phone) {
    if (firstName || lastName || password) {
      //check the user
      data.read("users", phone, (err, uData) => {
        const userData = { ...parseJSON(uData) };
        if (!err && userData) {
          firstName && (userData.firstName = firstName);
          lastName && (userData.lastName = lastName);
          password && (userData.password = hashing(password));
          //stor to database
          data.update("users", phone, userData, (err) => {
            if (!err) {
              callBack(200, {
                message: "user updated successfully",
              });
            } else {
              callBack(500, {
                error: "server side problem for updating",
              });
            }
          });
        } else {
          callBack(400, {
            error: "Your data is not found",
          });
        }
      });
    } else {
      callBack(400, {
        error: "You have a problem in your request",
      });
    }
  } else {
    callBack(400, {
      error: "Invalid Phone number. Please try again",
    });
  }
};

//delete method
handler_users.delete = (requestProperties, callBack) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length > 0
      ? requestProperties.queryStringObject.phone
      : null;

  if (phone) {
    data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        data.delete("users", phone, (err) => {
          if (!err) {
            callBack(200, {
              message: "user was successfully deleted",
            });
          } else {
            callBack(500, {
              error: "server side problem ",
            });
          }
        });
      } else {
        callBack(404, {
          error: "Requested user was not found",
        });
      }
    });
  } else {
    callBack(400, {
      error: "phone number is not valid",
    });
  }
};

module.exports = handler;
