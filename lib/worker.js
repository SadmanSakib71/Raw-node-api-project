//dependencies
const data = require("./data");

//worker object - module scaffolding

const worker = {};

//lookup all the checks
worker.gatherAllChecks = () => {
  //get all the checks
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
