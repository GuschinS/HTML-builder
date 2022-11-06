const fs = require("fs");
const path = require("path");

const filesFolder = path.join(__dirname, "files");
const filesCopyFolder = path.join(__dirname, "files-copy");

function copyDir() {
  fs.mkdir(filesCopyFolder, { recursive: true }, () => {});
  fs.readdir(filesCopyFolder, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    for (let file of files) {
      fs.unlink(path.join(filesCopyFolder, file.name), () => {});
    }
  });
  fs.readdir(filesFolder, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    let names = [];
    files.forEach((el) => names.push(el.name));
    for (let name of names) {
      fs.copyFile(
        path.join(filesFolder, name),
        path.join(filesCopyFolder, name),
        () => {}
      );
    }
  });
}

copyDir();
