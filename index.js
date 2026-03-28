//dependencies
const http = require("node:http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const data = require("./lib/data");

//app object - module scaffolding

const app = {};

//testing file system
data.update(
  "test",
  "newFile",
  { name: "england", language: "English" },
  (err) => {
    console.log(err);
  },
);

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
