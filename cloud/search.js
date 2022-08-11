const { JSDOM } = require("jsdom");
const axios = require("axios");
const Reddit = require("reddit");

async function getDOMFromSite(url) {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  return dom.window.document;
}

const reddit = new Reddit({
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
  appId: process.env.REDDIT_APP,
  appSecret: process.env.REDDIT_SECRET,
});

module.exports = {
  reddit: async (term) => {
    const data = await reddit.get("/r/ElectricUnicycle/search", {
      q: term,
      type: "comment",
      show: "all",
    });
    return data.data.children.map(({ data }) => ({
      title: data.title,
      link: data.url,
      date: new Date(data.created_utc * 1000),
      content: data.selftext,
    }));
  },
  forum: async (term) => {
    const url = `https://forum.electricunicycle.org/search/?q=${encodeURIComponent(
      term
    )}&quick=1`;
    const document = await getDOMFromSite(url);
    const matches = Array.from(document.querySelectorAll(".ipsStreamItem"));
    return matches.map((element) => ({
      title: element.querySelector(".ipsStreamItem_title").textContent.trim(),
      link: element
        .querySelector(".ipsStreamItem_title a")
        .getAttribute("href"),
      date: new Date(element.querySelector("time").getAttribute("datetime")),
      content: element.querySelector(".ipsType_richText").textContent.trim(),
    }));
  },
};