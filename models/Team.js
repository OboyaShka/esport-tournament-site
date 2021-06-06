const {Schema, model, Types} = require('mongoose')

const Team = new Schema({
    nickname: {type: String, required:true, unique: true},
    image: {type: String},
    summonersName: {type: String},
    steamID: {type: String},
    players: [{type: Types.ObjectId, ref: 'User'}],
    tournament: {type: Types.ObjectId, ref: 'Tournament'}
})

module.exports = model('Team', Team)