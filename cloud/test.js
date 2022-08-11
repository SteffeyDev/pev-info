require("dotenv").config();

const searchSources = require("./search");
searchSources[process.argv[2]](process.argv.slice(3).join(" ")).then(console.log);
