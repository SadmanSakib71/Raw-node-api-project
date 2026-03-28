//module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callBack) => {
  callBack(200, {
    title: "this is user handler",
  });
};

module.exports = handler;
