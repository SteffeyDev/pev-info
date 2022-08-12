const { getDOMFromSite } = require("./util");

module.exports = async (term) => {
  const url = `https://forum.electricunicycle.org/search/?q=${encodeURIComponent(
    term
  )}&quick=1`;
  const document = await getDOMFromSite(url);
  const matches = Array.from(document.querySelectorAll(".ipsStreamItem"));
  return matches.map((element) => ({
    title: element.querySelector(".ipsStreamItem_title").textContent.trim(),
    link: element.querySelector(".ipsStreamItem_title a").getAttribute("href"),
    date: new Date(element.querySelector("time").getAttribute("datetime")),
    content: element.querySelector(".ipsType_richText").textContent.trim(),
  }));
};
