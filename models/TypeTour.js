const {Schema, model, Types} = require('mongoose')

const TypeTour = new Schema({
    value: {type: String}
})

module.exports = model('TypeTour', TypeTour)