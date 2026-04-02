//dependencies
const data = require("./data");
const { hashing, parseJSON } = require("../helpers/utilities");

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
