const searchSources = require("./search");

// source: string (e.g. reddit, forum)
// id: string
Parse.Cloud.define("search", async (request) => {
  const searchFunc = searchSources[request.params.source];
  const query = Parse.Query("Vehicle");
  const vehicle = query.equalTo("id", request.params.id).first();
  if (vehicle && searchFunc) {
    return await searchFunc(`${vehicle.get("make")} ${vehicle.get("model")}`);
  }
});

// When insert row, automatically run search to fill in data
Parse.Cloud.afterSave("Vehicle", async (request) => {
  const vehicle = request.object;

  if (!vehicle.get("lastSearchedAt")) {
    const searchResults = await searchEverywhere(
      `${vehicle.get("make")} ${vehicle.get("model")}`
    );
    Object.keys(searchResults).forEach((key) => {
      vehicle.set(key, searchResults[key]);
    });
    vehicle.set("lastSearchedAt", new Date());
    await vehicle.save();
  }
});
