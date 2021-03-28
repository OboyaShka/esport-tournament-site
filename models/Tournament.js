const {Schema, model, Types} = require('mongoose')

const Tournament = new Schema({
    title: {type: String, required:true, unique: true},
    game: {type: String, ref: 'Game'},
    typeTour: {type: String, ref: 'TypeTour'},
    stateTour: {type: String, ref: 'StateTour', required:true},
    description: {type: String, required:true},
    image: {type: String, required:true},
    participants: [{type: Types.ObjectId, ref: 'User'}],
    date: {type: Date, required:true},
})

module.exports = model('Tournament', Tournament)