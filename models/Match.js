const {Schema, model, Types} = require('mongoose')

const Match = new Schema({
    tournament: {type: Types.ObjectId, ref: 'Tournament'},
    matchNumber: {type: Number, required:true},
    stateTour: {type: String, required:true},
    participants: [{type: Types.ObjectId, ref: 'User'}],
    winner: {type: Types.ObjectId, ref: 'User'},
    screen: {type: String},
    startDate: {type: Date},
    prevMatches: [{type: Types.ObjectId, ref: 'Match'}],
    nextMatch: {type: Types.ObjectId, ref: 'Match'},
})

module.exports = model('Match', Match)