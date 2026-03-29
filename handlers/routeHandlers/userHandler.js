//dependencies
const data = require("../../lib/data");

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
    requestProperties.body.tosAgreement.trim().length > 0
      ? requestProperties.body.tosAgreement
      : null;

  if (firstName && lastName && phone && password & tosAgreement) {
    //make sure user doesn't already exist
    data.read("users", "phone", (err, usersData) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password,
          tosAgreement,
        };
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
  callBack(200);
};

//put method
handler_users.put = (requestProperties, callBack) => {};

//delete method
handler_users.delete = (requestProperties, callBack) => {};

module.exports = handler;
