const { getDOMFromSite } = require("./util");

module.exports = {
  name: "INMOTION USA",
  types: ["manufacturer", "retailer"],
  getModels: async () => {
    const document = await getDOMFromSite("https://www.myinmotion.com");
    const matches = Array.from(
      document
        .querySelector('[data-controller-folder="eunicycle"]')
        .querySelectorAll(".Mobile-overlay-folder-item")
    );
    return matches
      .filter((element) => element.textContent.trim().startsWith("V"))
      .map((element) => ({
        make: "INMOTION",
        model: element.textContent.trim(),
        link: `https://www.myinmotion.com${element.getAttribute("href")}`,
      }));
  },
  getModelDetails: async ({ link }) => {
    const document = await getDOMFromSite(link, true);

    // These come from shopify iframe
    const priceNode = document.querySelector('[data-element="product.price"]');
    const descriptionNode = document.querySelector(
      '[data-element="product.description"]'
    );
    console.log(priceNode, descriptionNode);

    return {
      link: modelObj.link,
      price: priceNode ? priceNode.textContent : undefined,
      status: descriptionNode
        ? descriptionNode.textContent.toLowerCase().includes("backorder")
          ? "backorder"
          : "available"
        : undefined,
      specs: Array.from(
        document.querySelectorAll(".sqs-dynamic-text-container")
      )
        .filter((element) =>
          element.textContent.toLowerCase().includes("speed")
        )
        .reduce((specs, element) => {
          return [
            ...specs,
            ...element
              .querySelectorAll("p")[1]
              .innerHTML.split("<br>")
              .map((item) => item.replace(/<\/?strong>/g, "")),
          ];
        }, []),
      images: Array.from(
        document.querySelectorAll('[data-element="product.carouselitem"]')
      ).map((element) => element.getAttribute("href")),
    };
  },
};
