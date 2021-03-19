const {Schema, model, Types} = require('mongoose')

const Tournament = new Schema({
    title: {type: String, required:true, unique: true},
    game: {type: String, ref: 'Game'},
    description: {type: String, required:true},
    image: {type: String, required:true},
    participants: [{type: Types.ObjectId, ref: 'User'}],
    date: {type: Date, required:true},
})

module.exports = model('Tournament', Tournament)