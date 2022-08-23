const { getDOMFromSite } = require("./util");

module.exports = {
  name: "eWheels",
  type: ["retailer"],
  getModels: async () => {
    const { document } = await getDOMFromSite("https://www.ewheels.com/shop/");
    const matches = Array.from(document.querySelectorAll(".product"));
    return matches.map((element) => {
      const titleElement = element.querySelector(".product-title");
      const titleParts = titleElement.textContent
        .replace("King Song", "KingSong")
        .trim()
        .split(" ");
      if (titleParts[0].toUpperCase() === "NEW:") titleParts.shift();
      let make = titleParts[0].replace("KingSong", "King Song");
      let model = titleParts[1].replace(/(\.|,)$/, "");
      if (make === "MTen3") {
        model = make;
        make = "Begode";
      }
      return {
        make,
        model,
        link: titleElement.querySelector("a").getAttribute("href"),
      };
    });
  },
  getModelDetails: async ({ link }) => {
    const { document } = await getDOMFromSite(link);
    return {
      specs: {
        ...Array.from(
          document
            .querySelector(".woocommerce-Tabs-panel .fusion-content-boxes")
            .querySelectorAll(".content-box-wrapper")
        ).reduce(
          (acc, element) => ({
            ...acc,
            [element.querySelector(".content-box-heading").textContent.trim()]:
              element.querySelector(".content-container").textContent.trim(),
          }),
          {}
        ),
      },
    };
  },
};
