const mongoose = require("mongoose")
require('dotenv').config()

const mongo_uri = process.env.MONGO_URI

const connect_db = () => {
    mongoose.connect(mongo_uri)
    .then(() => {
        console.log('Connected to DB')
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports = connect_db;