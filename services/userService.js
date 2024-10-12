const User = require("../models/userModel")

/*
assume input data has structure as such
{
    username : "name",
    password : 123,
    email : "name@gmail.com"
}

*/
const createUser = async( userdata ) => {
    // check if username is already taken 
    const {username} = userdata
    try{
        const user = await User.where({username:username})
        console.log(user.length)
        if(user.length !== 0){
            throw new Error('username already exists')
        }else{
            const new_user = User(userdata)
            console.log(new_user)
            const user = await new_user.save()
            return user
        }
    }catch(error){
        console.log("error in creating user", error)
        throw error
    } 
}

// login 
/*
the return type will be a boolean indicating whether or not the user
is found in the database and is validated

*/
const login = async(userdata) => {

        const {username, password} = userdata
        const query = User.where({username:username})
        const user = await query.findOne()

        if (user){
            const password_in_db = user.password
            if(password_in_db === String(password)){
                console.log("user exists and the password matches")
                return true
            }
        }

        return false
}



module.exports = {
    createUser,
    login
}