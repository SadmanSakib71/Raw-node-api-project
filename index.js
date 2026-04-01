//dependencies
require("dotenv").config();
const http = require("node:http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const data = require("./lib/data");
const { sendTwilioSms } = require("./helpers/notifications");

//app object - module scaffolding

const app = {};

sendTwilioSms("01788539666", "My name is sakib", (e) => {
  console.log(e, "sakib");
});

//create server

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`server run on ${environment.port} port`);
  });
};

//handle Request Response

app.handleReqRes = handleReqRes;

app.createServer();
