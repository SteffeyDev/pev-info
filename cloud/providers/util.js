const { JSDOM } = require("jsdom");
const axios = require("axios");
const phantom = require("phantomjscloud");
const fs = require('fs');

async function getDOMFromSite(url, renderInBrowser = false) {
  let html;
  if (renderInBrowser) {
    const browser = new phantom.BrowserApi();
    html = await new Promise((resolve, reject) =>
      browser.requestSingle(
        { url, renderType: "plainText" },
        (err, userResponse) => {
          //can use a callback like this example, or a Promise (see the Typescript example below)
          if (err != null) {
            reject(err);
          }
          fs.writeFile(
            userResponse.content.name,
            userResponse.content.data,
            { encoding: userResponse.content.encoding },
            function (err) {
              console.log("File created");
            }
          );
          resolve(userResponse.content.data);
        }
      )
    );
  } else {
    html = (await axios.get(url)).data;
  }
  const dom = new JSDOM(html);
  return dom.window.document;
}

module.exports = {
  getDOMFromSite,
};
