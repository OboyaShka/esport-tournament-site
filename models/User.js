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
    blueCoin:{type: Number},
    stat_lol_tournaments_played:{type: Number},
    stat_lol_tournaments_wins:{type: Number},
    stat_lol_tournaments_prizer:{type: Number},
    stat_lol_tournaments_rating:{type: Number},
    stat_lol_total_RC:{type: Number},
    stat_lol_total_BC:{type: Number},
    stat_dota2_tournaments_played:{type: Number},
    stat_dota2_tournaments_wins:{type: Number},
    stat_dota2_tournaments_prizer:{type: Number},
    stat_dota2_tournaments_rating:{type: Number},
    stat_dota2_total_RC:{type: Number},
    stat_dota2_total_BC:{type: Number},
})

module.exports = model('User', User)