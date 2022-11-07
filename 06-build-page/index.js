const fs = require("fs");
const path = require("path");

const projectDist = path.join(__dirname, "project-dist");
const pathIndex = path.join(__dirname, "project-dist", "index.html");
const pathStyle = path.join(__dirname, "project-dist", "style.css");
const pathTemplate = path.resolve(__dirname, "template.html");
const components = path.resolve(__dirname, "components");
const styles = path.join(__dirname, "styles");
const assets = path.join(__dirname, "assets");
const copyAssets = path.join(__dirname, "project-dist", "assets");

createHTML();
createCSS();

function createCSS() {
  fs.mkdir(projectDist, { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.mkdir(copyAssets, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.writeFile(pathStyle, "", (err) => {
    if (err) throw err;
  });

  fs.readdir(styles, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    let readStream;
    const writeStream = fs.createWriteStream(pathStyle);
    for (let file of files) {
      if (file.name.split(".")[1] === "css") {
        readStream = fs.createReadStream(path.join(styles, file.name), "utf-8");
        readStream.pipe(writeStream);
      }
    }
  });
  copyDir(assets, copyAssets);
}

function copyDir(assets, copyAssets) {
  fs.readdir(assets, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((el) => {
      if (el.isDirectory()) {
        const nextPath = path.join(copyAssets, el.name);
        const nextRead = path.join(assets, el.name);
        fs.mkdir(nextPath, { recursive: true }, (err) => {
          if (err) throw err;
        });
        copyDir(nextRead, nextPath);
      } else {
        fs.copyFile(
          path.join(assets, el.name),
          path.join(copyAssets, el.name),
          (err) => {
            if (err) throw err;
          }
        );
      }
    });
  });
}

function createHTML() {
  const readStreamTemplate = fs.createReadStream(pathTemplate, "utf-8");
  let template = "";
  let arrayComponents = [];

  readStreamTemplate.on("data", (chunk) => (template += chunk));
  readStreamTemplate.on("end", () => {
    fs.readdir(components, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        if (!file.isDirectory() && file.name.split(".")[1] === "html") {
          arrayComponents.push(file.name.toString());
        }
      });
      //   const writeStream = fs.createWriteStream(
      //     path.join(pathTemplate, template)
      //   );
      arrayComponents.forEach((el) => {
        const pathComponent = path.join(components, el);
        let component = "";
        const readStreamComponent = fs.createReadStream(pathComponent, "utf-8");
        readStreamComponent.on("data", (chunk) => (component += chunk));
        readStreamComponent.on("end", () => {
          let componentName = el.split(".")[0];
          template = template.replace(`{{${componentName}}}`, component);
          fs.writeFile(pathIndex, template, (err) => {
            if (err) throw err;
          });
          // readStreamComponent.pipe(writeStream);
        });
      });
    });
  });
}
