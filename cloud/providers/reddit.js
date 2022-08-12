const Reddit = require("reddit");

const reddit = new Reddit({
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
  appId: process.env.REDDIT_APP,
  appSecret: process.env.REDDIT_SECRET,
});

module.exports = async (term) => {
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
};
