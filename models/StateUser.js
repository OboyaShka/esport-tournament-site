const {Schema, model, Types} = require('mongoose')

const StateUser = new Schema({
    value: {type: String}
})

module.exports = model('StateUser', StateUser)