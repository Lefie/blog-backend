const express = require("express")
const connect_db = require("./configs/db")
const user_routes = require("./routes/userRoutes")
const blog_routes = require("./routes/blogRoutes")
const session = require('express-session')
require('dotenv').config()



const app = express()
const port = process.env.PORT

// session middleware 
app.use(session({
    secret: 'a-blue-cat',
    resave: false,
    saveUninitialized: false
}))
app.use(express.json())

app.use("/users",user_routes)
app.use("/blogs",blog_routes)


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

