
const authenticate = (req, res, next) => {

    const cookie = req.cookies
    const isLoggedin = cookie["chocolate_cookie"].isLoggedin
    const username = cookie["chocolate_cookie"].username 

    console.log("cookie from authenticate",req.cookies, isLoggedin, username)

    if(isLoggedin && username){
        console.log("the user is currently logged in")
        next()
    }else{
        res.sendStatus(403)
    }
   
} 

module.exports = authenticate