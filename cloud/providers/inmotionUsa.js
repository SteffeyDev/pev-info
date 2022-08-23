const { getDOMFromSite } = require("./util");

module.exports = {
  name: "INMOTION USA",
  types: ["manufacturer", "retailer"],
  getModels: async () => {
    const { document } = await getDOMFromSite("https://www.myinmotion.com");
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
  getModelDetails: async ({ link, model }) => {
    const { document, frames } = await getDOMFromSite(link, true);

    // These come from shopify iframe
    const shopifyFrame = frames.find(
      (frame) =>
        frame.name.startsWith("frame-product") &&
        frame.content.querySelector('[data-element="product.description"]')
    ).content;
    const priceNode = shopifyFrame.querySelector(
      '[data-element="product.price"]'
    );
    const descriptionNode = shopifyFrame.querySelector(
      '[data-element="product.description"]'
    );
    console.log(priceNode, descriptionNode);

    const status = descriptionNode
      ? descriptionNode.textContent.toLowerCase().includes("backorder")
        ? "backorder"
        : "available"
      : undefined;

    return {
      link,
      price:
        status === "backorder"
          ? descriptionNode.textContent.match(/\$\d+/)[0]
          : priceNode
          ? priceNode.textContent
          : undefined,
      status,
      specs: Array.from(
        document.querySelectorAll(".sqs-dynamic-text-container")
      )
        .filter((element) =>
          element.textContent.toLowerCase().includes("specs")
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
      images: [
        ...Array.from(
          shopifyFrame.querySelectorAll('[data-element="product.carouselitem"]')
        ).map((element) => element.getAttribute("href")),
        ...Array.from(
          document.querySelectorAll(".sqs-image-shape-container-element img")
        )
          .map((element) => element.getAttribute("src"))
          .filter((src) => !src.includes("ezgif")),
      ],
    };
  },
};
