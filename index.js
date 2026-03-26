//dependencies
const http = require("node:http");

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

app.handleReqRes = (req, res) => {
  //response handle
  res.end("Hello world bye hello");
};

app.createServer();
