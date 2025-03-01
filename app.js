const express = require("express")
const connect_db = require("./configs/db")
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
const port = process.env.PORT

//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


app.use(cookieParser())
app.use(body_parser.json())
//app.use(express.json())

const allowedOrigins = ["http://localhost:3000","http://127.0.0.1:3000"]

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
    }
))


app.use("/users",user_routes)
app.use("/blogs",blog_routes)
app.use("/img",image_routes)


//test route
app.get("/", (req, res) => {
    const sessionData = req.session
    // req.session.isLoggedin = true
    // req.session.username = "lemon"
    // console.log(sessionData.cookie)
    // console.log(sessionData.username)
    // console.log(sessionData.isLoggedin)
    // console.log("cookiessss",req.cookies)
    res.send("Hello")
})


app.listen(port || 5050, () => {
    console.log("app is listening at port", port)
})

connect_db()

