

const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()


const app = express()
const port = process.env.PORT
const mongo_uri = process.env.MONGO_URI

app.get("/", (req, res) => {
    res.send("Hello")
})

app.listen(port || 5050, () => {
    console.log("app is listening at port", port)
})

mongoose.connect(mongo_uri)
.then(() => {
    console.log('Connected to DB')
})
.catch((error) => {
    console.log(error)
})