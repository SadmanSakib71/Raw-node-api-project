//dependencies

const fs = require("node:fs");
const path = require("node:path");

//module object - scaffolding
const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname, "/.data/");

//write data to file
lib.create = function (dir, file, data, callBack) {
  //open file for writing
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        //convert data to string
        const stringData = JSON.stringify(data);
      } else {
        callBack("could not create new file it already exist");
      }
    },
  );
};
