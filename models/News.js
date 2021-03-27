const {Schema, model, Types} = require('mongoose')

const News = new Schema({
    title: {type: String, required:true, unique: true},
    topic: {type: String, required:true},
    image: {type: String, required:true},
    content: {type: String, required:true},
    date: {type: Date, required:true},
})

module.exports = model('News', News)