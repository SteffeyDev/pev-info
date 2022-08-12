const { JSDOM } = require("jsdom");
const axios = require("axios");

async function getDOMFromSite(url) {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  return dom.window.document;
}

module.exports = {
    getDOMFromSite
}