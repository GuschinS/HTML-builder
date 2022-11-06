const fs = require("fs");
const path = require("path");

const readFile = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8");

readFile.on("data", (chunk) => {
  process.stdout.write(chunk);
});
