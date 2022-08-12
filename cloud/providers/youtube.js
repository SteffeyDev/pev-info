const { google } = require("googleapis");

const youtube = google.youtube({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY
});

module.exports = async (term) => {
  const res = await youtube.search.list({
    part: "id,snippet",
    q: term,
    maxResults: 10
  });
  return res.data.items.map(item => ({
    title: item.snippet.title,
    content: item.snippet.description,
    date: new Date(item.snippet.publishTime),
    link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }))
};
