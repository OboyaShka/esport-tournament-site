const {Schema, model, Types} = require('mongoose')

const User = new Schema({
    nickname: {type: String, required:true, unique: true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required:true},
    image: {type: String},
    roles: [{type: String, ref: 'Role'}],
    tournaments: [{type: Types.ObjectId, ref: 'Tournament'}],
    summonersName: {type: String},
})

module.exports = model('User', User)