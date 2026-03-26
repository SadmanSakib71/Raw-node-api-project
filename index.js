//dependencies
const http = require("node:http");
const { handleReqRes } = require("./helpers/handleReqRes");

//app object - module scaffolding

const app = {};

//configuration

app.config = {
  port: 3000,
};

//create server

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`server run on ${app.config.port} port`);
  });
};

//handle Request Response

app.handleReqRes = handleReqRes;

app.createServer();
