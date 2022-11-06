const fs = require("fs");
const path = require("path");

const secretFolder = path.join(__dirname, "secret-folder");

fs.readdir(secretFolder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (!file.isDirectory()) {
      fs.stat(path.join(secretFolder, file.name), (error, stats) => {
        if (error) {
          console.log(error);
        }
        let extname = path.extname(file.name).slice(1);
        let fileName = file.name.split(".")[0];
        let fileSize = stats.size / 1000;
        console.log(`${fileName} - ${extname} - ${fileSize}kb`);
      });
    }
  });
});
