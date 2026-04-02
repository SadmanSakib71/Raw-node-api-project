//dependencies
const data = require("./data");
const { hashing, parseJSON } = require("../helpers/utilities");
const url = require("node:url");
const http = require("node:http");
const https = require("node:https");

//worker object - module scaffolding

const worker = {};

//lookup all the checks
worker.gatherAllChecks = () => {
  //get all the checks
  data.list("checks", (err, checks) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach((check) => {
        data.read("checks", check, (err, checkData) => {
          if (!err && checkData) {
            worker.validateCheckData(parseJSON(checkData));
          } else {
            console.log("error one of the check data");
          }
        });
      });
    } else {
      console.log("Not found any checks");
    }
  });
};

//validate individual check data
worker.validateCheckData = (checkData) => {
  if (checkData && checkData.checkId) {
    checkData.state =
      typeof checkData.state === "string" &&
      ["up", "down"].indexOf(checkData.state) > -1
        ? checkData.state
        : "down";

    checkData.lastChecked =
      typeof checkData.lastChecked === "number" &&
      checkData.lastChecked.length > 0
        ? checkData.lastChecked
        : false;

    //pass to the next process
    worker.performCheck(checkData);
  } else {
    console.log("Error:check was invalid");
  }
};

//perform check
worker.performCheck = (checkData) => {
  //prepare the initial check out come
  let checkOutCome = {
    error: false,
    responseCode: false,
  };

  //mark the outcome has not been sent
  let outComeSent = false;

  //parse the hostName and full url from check data
  const parsedUrl = url.parse(`${checkData.protocol}://${checkData.url}`, true);
  const hostName = parsedUrl.hostname;
  const path = parsedUrl.path;

  //construct the request object
  const requestDetails = {
    protocol: `${checkData.protocol}:`,
    hostName: hostName,
    path,
    method: checkData.method.toUpperCase(),
    timeOut: checkData.timeoutSeconds * 1000,
  };
  const protocolToUse = checkData.protocol === "http" ? http : https;

  let req = protocolToUse.request(requestDetails, (res) => {
    //grab the status from response
    const status = res.statusCode;
    //update the outcome and pass to the next process
    checkOutCome.responseCode = status;
    if (!outComeSent) {
      worker.processCheckOutCome(checkData, checkOutCome);
      outComeSent = true;
    }
  });

  req.on("error", (e) => {
    let checkOutCome = {
      error: true,
      value: e,
    };
    //update the outcome and pass to the next process
    if (!outComeSent) {
      worker.processCheckOutCome(checkData, checkOutCome);
      outComeSent = true;
    }
  });

  req.on("timeout", (e) => {
    let checkOutCome = {
      error: true,
      value: e,
    };
    //update the outcome and pass to the next process
    if (!outComeSent) {
      worker.processCheckOutCome(checkData, checkOutCome);
      outComeSent = true;
    }
  });

  req.end();
};

//timer to execute the worker process one per minute
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 1000 * 60);
};
//start the worker

worker.init = () => {
  //execute all the checks
  worker.gatherAllChecks();
  //create a loop so that checks continue
  worker.loop();
};

module.exports = worker;
