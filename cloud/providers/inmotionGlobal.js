const { getDOMFromSite } = require("./util");

module.exports = {
  name: "INMOTION Global",
  types: ["manufacturer"],
  getModels: async () => {
    const { document } = await getDOMFromSite(
      "https://www.inmotionworld.com/electric-unicycle"
    );
    const matches = Array.from(document.querySelectorAll(".product-item"));
    return matches.map((element) => ({
      make: "INMOTION",
      model: element.querySelector("h2").textContent.trim(),
      link: `https://www.inmotionworld.com${element
        .querySelector(".link")
        .getAttribute("href")}`,
    }));
  },
  getModelDetails: async ({ model }) => {
    const { document: listDocument } = await getDOMFromSite(
      "https://www.inmotionworld.com/electric-unicycle"
    );
    const matches = Array.from(listDocument.querySelectorAll(".product-item"));
    for (const element of matches) {
      if (model === element.querySelector("h2").textContent.trim()) {
        const link = `https://www.inmotionworld.com${element
            .querySelector(".link")
            .getAttribute("href")}`;
        const { document: detailDocument } = await getDOMFromSite(link);
        return {
          link,
          specs: element
            .querySelector("p")
            .textContent.split(" | ")
            .map((item) => item.trim()),
          images: Array.from(
            detailDocument.querySelector(".page").querySelectorAll("img")
          ).map((element) => element.getAttribute("src")),
        };
      }
    }
  },
};
