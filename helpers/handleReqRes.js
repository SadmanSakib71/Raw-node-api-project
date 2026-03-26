//dependencies

const url = require("node:url");
const { StringDecoder } = require("node:string_decoder");

//app object - module scaffolding

const handler = {};

handler.handleReqRes = (req, res) => {
  //request handle

  //get the url and parse it
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  //get the method
  const method = req.method.toLowerCase();
  //get query string
  const queryStringObject = parseUrl.query;
  //get header
  const headerObject = req.headers;

  //get data from body
  const decoder = new StringDecoder("utf-8");
  let realData = "";

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    console.log(realData);

    //response handle
    res.end("Hello world bye hello");
  });
};

module.exports = handler;
