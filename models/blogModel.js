const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    title : {type:String, required: true},
    content: {type:String, required: true},
    updated_date : {type:Date},
    date: {type: Date, default:Date.now},
    author : {type:String, required:true},
    img_url : {type:String}
})

module.exports =  mongoose.model('Blog',blogSchema)