module.exports = {
    /*
     * Each information provider is an object with the following properties:
     * types: ('manufacturer' | 'retailer')[] sometimes manufacturer also retails
     * name: name of the provider
     * getModels: a function that returns a list of models, each with `make`, `model`, and `link`
     * getModelDetails: a function that takes the object returned from getModels and returns an additional information:
     * {
     *   specs: string[] | Record<string, string> that contains the raw details from the site
     *   images: string[] links to all the images from the details page
     *   link: full link to model details
     *   status: 'available' | 'backorder'
     *   price: raw cost string
     * }
     */
    info: {
        inmotionGlobal: require('./inmotionGlobal'),
        inmotionUsa: require('./inmotionUsa'),
        ewheels: require('./ewheels')
    },

    /*
     * Each search provider is a function that takes a term and returns a list of items with the schema:
     * {
     *   title
     *   content: paragraph description (can include \n)
     *   link: full link to the content item on the provider's site
     *   date: when the content was first posted as a Date object
     * }
     */
    search: {
        reddit: require('./reddit'),
        forum: require('./forum'),
        youtube: require('./youtube')
    }
}