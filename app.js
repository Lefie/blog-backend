const express = require("express")
const user_routes = require("./routes/userRoutes")
const blog_routes = require("./routes/blogRoutes")
const image_routes = require("./routes/imageRoute")
//const session = require('express-session')
const cors = require('cors')
require('dotenv').config()
const body_parser = require('body-parser')
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2


const app = express()


//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


app.use(cookieParser())
app.use(body_parser.json())
//app.use(express.json())

const allowedOrigins = ["http://localhost:3000","http://127.0.0.1:3000","https://blog-frontend-1-nine.vercel.app"]

// cors enabled
app.use(cors({
    origin: function(origin, cb){
        if(allowedOrigins.includes(origin) || !origin){
            cb(null, true)
        }else{
            cb(new Error("not allowed by CORS"))
        }
    },
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
    }
))


app.use("/users",user_routes)
app.use("/blogs",blog_routes)
app.use("/img",image_routes)


//test route
app.get("/", (req, res) => {
    const sessionData = req.session

    res.send("Hello")
    res.status(200)
})


module.exports = app;

