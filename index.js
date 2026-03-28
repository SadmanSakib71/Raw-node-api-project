//dependencies
const http = require("node:http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const data = require("./lib/data");

//app object - module scaffolding

const app = {};

//testing file system
data.read("test", "newFile", (err, data) => {
  console.log(err, data);
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
