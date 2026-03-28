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

handler_users.post = (requestProperties, callBack) => {};
handler_users.get = (requestProperties, callBack) => {
  callBack(200);
};
handler_users.put = (requestProperties, callBack) => {};
handler_users.delete = (requestProperties, callBack) => {};

module.exports = handler;
