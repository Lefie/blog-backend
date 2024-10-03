
const authenticate = (req, res, next) => {

    const session = req.session
    const isLoggedin = session.isLoggedin
    const username = session.username

    if(isLoggedin && username){
        console.log("the user is currently logged in")
        next()
    }else{
        res.sendStatus(403)
    }
} 


module.exports = authenticate