
const userService = require("../services/userService")

const signup = async(req, res) => {
    try {
        const user = await userService.createUser(req.body)
        console.log(user)
        res.status(200).json(user)

    }catch(err) {
        console.log(req.body)
        res.status(500).json({err:err.message})
    }
}

const login = async(req, res) => {
    try {
        console.log("I am in login")
        const user = await userService.login(req.body)
        console.log("from user controller user object", user)
        if(user.userExists && user.passwordCorrect){
            console.log(" in the login", user)
            const cookieData = {'isLoggedin':true, 'username':req.body.username}
            res.cookie('chocolate_cookie',{username:req.body.username, isLoggedin:true},{
                httpOnly:true,
                secure:true,
                sameSite:'None',
                maxAge: 24 * 60 * 60 * 1000,
            })
            
            return res.status(200).json(cookieData)

        }else{
            return res.status(200).json(user)
        }

    }catch(err){
        return res.status(500).json({error:"error logging in user" + err})
    }
}

const logout = async(req, res) => {
    try {
        if(req.cookies['chocolate_cookie']){    
            res.clearCookie('chocolate_cookie')
            res.status(200).json({msg:'logged out'})
        }else{
            res.status(500).json({msg:'already logged out'})
        }
    
    }catch(error){
        res.status(500).json({error:"error logging out"})
    }
}

const testUser = async(req, res) => {
    console.log("I am just here to test session")
    console.log(req.cookies)
    res.status(200).json({session:req.cookies})
}

// CAREFUL: delete all users
const delete_all_users =  async(req, res) => {
    try {
        const deleted_users = await userService.deleteAllUsers()
       
        if(deleted_users) {
            return res.status(200).json({"msg":"delete success"})
        }else {
            return res.status(500).json({"msg":"delete failed"})
        }

    }catch(error){
        return res.status(500).json({error:"error deleting all users"})
    }
}

module.exports = {
    signup,
    login,
    logout,
    testUser,
    delete_all_users
}

