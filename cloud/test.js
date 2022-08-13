require("dotenv").config();

const providers = require("./providers");
const type = process.argv[2];
const provider = process.argv[3];
if (!(type in providers)) {
  console.error(
    `Type should be one of ${Object.keys(providers).join(
      ", "
    )}, "${type}" is not supported`
  );
  process.exit(1);
}
if (!(provider in providers[type])) {
  console.error(
    `Provider should be one of ${Object.keys(providers[type]).join(
      ", "
    )}, "${provider}" is not supported`
  );
  process.exit(1);
}

if (type === "info") {
  const command = process.argv[4];
  switch (command) {
    case "models":
      providers[type][provider]
        .getModels()
        .then(console.log)
        .catch(console.error);
      break;
    case "details": {
      providers[type][provider]
        .getModels()
        .then((models) => {
          const modelObj = models.find(
            (m) =>
              m.make.replace(/\s/g, "") === process.argv[5] &&
              m.model === process.argv.slice(6).join(" ")
          );
          if (modelObj)
            providers[type][provider]
              .getModelDetails(modelObj)
              .then(console.log)
              .catch(console.error);
          else console.log("Model not found");
        })
        .catch(console.error);
      break;
    }
  }
} else {
  const term = process.argv.slice(4).join(" ");
  providers[type][provider](term).then(console.log).catch(console.error);
}
