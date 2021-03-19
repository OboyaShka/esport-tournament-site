const {Schema, model, Types} = require('mongoose')

const Game = new Schema({
    value: {type: String, unique: true}
})

module.exports = model('Game', Game)