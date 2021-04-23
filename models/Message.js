const {Schema, model, Types} = require('mongoose')

const Message = new Schema({
    content:  {type: String},
    user: {type: Types.ObjectId, ref: 'User', required:true},
    nickname: {type: String},
    match: {type: Types.ObjectId, ref: 'Match', required:true},
    date: {type: Date},
})

module.exports = model('Message', Message)