require("dotenv").config();

const providers = require("./providers");
const type = process.argv[2];
const provider = process.argv[3];
const term = process.argv.slice(4).join(' ');
if (!(type in providers)) {
    console.error(`Type should be one of ${Object.keys(providers).join(', ')}, "${type}" is not supported`)
    process.exit(1);
}
if (!(provider in providers[type])) {
    console.error(`Provider should be one of ${Object.keys(providers[type]).join(', ')}, "${provider}" is not supported`)
    process.exit(1);
}
providers[type][provider](term).then(console.log);
