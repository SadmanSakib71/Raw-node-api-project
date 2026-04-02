//dependencies
require("dotenv").config();
const http = require("node:http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const data = require("./lib/data");
const { sendTwilioSms } = require("./helpers/notifications");
const server = require("./lib/server");
const worker = require("./lib/worker");

//app object - module scaffolding

const app = {};

app.init = () => {
  //start the server
  server.init();

  //worker starts
  worker.init();
};

app.init();

module.exports = app;
