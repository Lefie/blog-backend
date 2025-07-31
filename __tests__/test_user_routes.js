const request = require("supertest")
const app = require("../app")
const mongoose = require("mongoose");
const User = require("../models/userModel")
require("dotenv").config();


beforeEach( async () => {
    await mongoose.connect(process.env.MONGO_URI)
})

afterEach( async () => {
    await User.deleteOne({"username":"LeoKing"}) // clean up the user created for registration after test
    await mongoose.connection.close()
})

describe("POST /users/signup", ()=>{
    test("should create a new user", async() => {
        const new_user = {
            username: "LeoKing",
            password: "12345",
            email: "leoking@gmail.com"
        }

        const res = await request(app)
                    .post("/users/signup")
                    .send(new_user)

        expect(res.statusCode).toBe(200)
        expect(res.body.username).toBe("LeoKing")
        expect(res.body.password).toBe("12345")
        expect(res.body.email).toBe("leoking@gmail.com")
    })
})


