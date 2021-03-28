const {Schema, model, Types} = require('mongoose')

const StateTour = new Schema({
    value: {type: String}
})

module.exports = model('StateTour', StateTour)