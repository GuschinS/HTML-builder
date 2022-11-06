const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;

const filePath = path.join(__dirname, "text.txt");
const createWrite = fs.createWriteStream(filePath);

stdout.write("Write your text:\n");
stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") {
    process.exit();
  }
  createWrite.write(data);
});
process.on("SIGINT", () => process.exit());
process.on("exit", () => stdout.write("Good Luck!"));
