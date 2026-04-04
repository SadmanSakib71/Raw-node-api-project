//dependencies

const http = require("node:http");
const { handleReqRes } = require("../helpers/handleReqRes");
const environment = require("../helpers/environments");
const data = require("./data");
const { sendTwilioSms } = require("../helpers/notifications");

//server object - module scaffolding

const server = {};

//create server

server.createServer = () => {
  const serverVariable = http.createServer(server.handleReqRes);
  serverVariable.listen(environment.port, () => {
    console.log(`server run on ${environment.port} port`);
  });
};

//handle Request Response

server.handleReqRes = handleReqRes;

server.init = () => {
  server.createServer();
};

module.exports = server;
