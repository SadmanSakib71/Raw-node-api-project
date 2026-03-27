//dependencies

const fs = require("node:fs");
const path = require("node:path");

//module object - scaffolding
const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname, "../.data/");

//write data to file
lib.create = (dir, file, data, callBack) => {
  //open file for writing
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //convert data to string
      const stringData = JSON.stringify(data);

      //writing data file and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callBack(false);
            } else {
              callBack("Error closing the new file");
            }
          });
        } else {
          callBack("Error writing to nee file!");
        }
      });
    } else {
      callBack(`${err}`);
    }
  });
};

module.exports = lib;
