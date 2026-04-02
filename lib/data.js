//dependencies

const fs = require("node:fs");
const path = require("node:path");

//module object - scaffolding
const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname, "../.dataCenter/");

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

//read data from file
lib.read = (dir, file, callBack) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callBack(err, data);
  });
};

//update existing file
lib.update = (dir, file, data, callBack) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //convert the data to string
      const stringData = JSON.stringify(data);

      //truncate the file,blank the file
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          //Write the file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callBack(false);
                } else {
                  callBack("Error closing file");
                }
              });
            } else {
              callBack("Error writing to file");
            }
          });
        } else {
          callBack("Error Truncation file");
        }
      });
    } else {
      callBack("Error Open file");
    }
  });
};

//delete the file
lib.delete = (dir, file, callBack) => {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callBack(false);
    } else {
      callBack(err);
    }
  });
};

//list all the items in a directory

lib.list = (dir, callBack) => {
  fs.readdir(`${lib.basedir + dir}/`, (err, fileNames) => {
    if (!err && fileNames && fileNames.length > 0) {
      let trimmedFileNames = [];
      fileNames.forEach((fileName) => {
        trimmedFileNames.push(fileName.replace(".json", ""));
      });
      callBack(false, trimmedFileNames);
    } else {
      callBack("Error reading directory");
    }
  });
};

module.exports = lib;
