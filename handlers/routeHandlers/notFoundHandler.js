//module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callBack) => {
  callBack(404, {
    message: "your requested property is not found abhik vai",
  });
};

module.exports = handler;
