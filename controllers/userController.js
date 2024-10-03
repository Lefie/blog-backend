const userService = require("../services/userService")


const signup = async(req, res) => {
    try {
        
        const user = await userService.createUser(req.body)
        console.log(user)
        res.status(200).json(user)

    }catch(err) {
        res.status(500).send(err)
    }
}

const login = async(req, res) => {
    try {
        console.log("I am in login")
        const isUser = await userService.login(req.body)
        console.log("from user controller user object", isUser)
        if(isUser){
            req.session.isLoggedin = true 
            req.session.username = req.body.username
        }
        res.status(200).json(req.session)

    }catch(err){
        res.status(500).send(err)
    }

}

const logout = async(req, res) => {
    try {
        if(req.session.username && req.session.password){
            req.session.destroy()
            res.status(200).json({"msg":"you are logged out"})
        }else{
            res.status(200).json({"msg":"you are already logged out"})
        }
    
    }catch(error){
        res.status(500).send(error)
    }
}

module.exports = {
    signup,
    login,
    logout
}

