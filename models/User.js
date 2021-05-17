const {Schema, model, Types} = require('mongoose')

const User = new Schema({
    nickname: {type: String, required:true, unique: true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required:true},
    image: {type: String},
    roles: [{type: String, ref: 'Role'}],
    tournaments: [{
        tournamentId: {type: Types.ObjectId, ref: 'Tournament'},
        status: {type: String, ref: 'StateUser'}
    }],
    summonersName: {type: String},
    redCoin:{type: Number},
    blueCoin:{type: Number}
})

module.exports = model('User', User)