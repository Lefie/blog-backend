const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    title : {type:String, required: true},
    content: {type:String, required: true},
    date: {type: String},
    updated_date : {type:String},
    author : {type:String, required:true},
    img_url : {type:String}
})

module.exports =  mongoose.model('Blog',blogSchema)