const providers = require("./providers");

// source: string (e.g. reddit, forum)
// id: string
Parse.Cloud.define("search", async (request) => {
  const { provider, id } = request.params;

  const query = new Parse.Query("Vehicle");
  const vehicle = await query.get(id);
  if (!vehicle) throw new Error("Vehicle does not exist")

  const searchFunc = providers.search[provider];
  if (!searchFunc) throw new Error("Provider not valid")

  return await searchFunc(`${vehicle.get("make")} ${vehicle.get("model")}`);
}, {
  requireUser: false,
  requireMaster: false,
  fields: {
    provider: {
      required: true,
      type: String,
      options: Object.keys(providers.search)
    },
    id: {
      required: true,
      type: String
    }
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
