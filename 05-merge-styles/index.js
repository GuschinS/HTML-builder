const fs = require("fs");
const path = require("path");

const styles = path.join(__dirname, "styles");
const projectDist = path.join(__dirname, "project-dist");

fs.readdir(styles, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  let readStream;
  const writeStream = fs.createWriteStream(
    path.join(projectDist, "bundle.css")
  );
  for (let file of files) {
    if (file.name.split(".")[1] === "css") {
      readStream = fs.createReadStream(path.join(styles, file.name), "utf-8");
      readStream.pipe(writeStream);
    }
  }
});
