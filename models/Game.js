const {Schema, model, Types} = require('mongoose')

const Game = new Schema({
    value: {type: String}
})

module.exports = model('Game', Game)