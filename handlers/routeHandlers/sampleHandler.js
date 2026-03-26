//module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callBack) => {
  callBack(200, {
    title: "this is sadman sakib",
  });
};

module.exports = handler;
