require("dotenv").config();

const providers = require("./providers");
const type = process.argv[2];
const provider = process.argv[3];
if (!(type in providers)) {
    console.error(`Type should be one of ${Object.keys(providers).join(', ')}, "${type}" is not supported`)
    process.exit(1);
}
if (!(provider in providers[type])) {
    console.error(`Provider should be one of ${Object.keys(providers[type]).join(', ')}, "${provider}" is not supported`)
    process.exit(1);
}

if (type === "info") {
    const command = process.argv[4];
    switch (command) {
        case 'models': providers[type][provider].getModels().then(console.log); break;
        case 'details': providers[type][provider].getModelDetails({
            make: process.argv[5],
            model: process.argv[6]
        }).then(console.log); break;
    }
} else {
    const term = process.argv.slice(4).join(' ');
    providers[type][provider](term).then(console.log);
}
