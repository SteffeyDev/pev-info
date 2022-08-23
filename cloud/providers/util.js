const { JSDOM } = require("jsdom");
const axios = require("axios");
const phantom = require("phantomjscloud");
const fs = require('fs');

async function getDOMFromSite(url, renderInBrowser = false) {
  let html;
  if (renderInBrowser) {
    const browser = new phantom.BrowserApi();
    const { content: { data }, pageResponses } = await new Promise((resolve, reject) =>
      browser.requestSingle(
        { url, renderType: "html", outputAsJson: true },
        (err, userResponse) => {
          //can use a callback like this example, or a Promise (see the Typescript example below)
          if (err != null) {
            reject(err);
          }
          // Uncomment to debug
          // fs.writeFileSync('page.json', JSON.stringify(userResponse.pageResponses[0]));
          // fs.writeFile(
          //   userResponse.content.name,
          //   userResponse.content.data,
          //   { encoding: userResponse.content.encoding },
          //   function (err) {
          //     console.log("File created");
          //   }
          // );
          resolve(userResponse);
        }
      )
    );
    return {
      document: new JSDOM(data).window.document,
      frames: pageResponses[0].frameData.childFrames.map(frame => ({
        ...frame,
        content: new JSDOM(frame.content).window.document
      }))
    };
  } else {
    html = (await axios.get(url)).data;
    const dom = new JSDOM(html);
    return { document: dom.window.document };
  }
}

module.exports = {
  getDOMFromSite,
};
