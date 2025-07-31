const request = require("supertest")
const app = require("../app")
const mongoose = require("mongoose");
require("dotenv").config();


beforeEach( async () => {
    await mongoose.connect(process.env.MONGO_URI)
})

afterEach( async () => {
    await mongoose.connection.close()
})

describe("test retrieving a single blog", ()=>{
    test("should retrieve one blog provided the blog id ", async()=>{
        const url = `/blogs/blog/687e8249ec7acd1c4d9fce57`
        const res = await request(app).get(url)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({"_id":"687e8249ec7acd1c4d9fce57","title":"Ice Cream","content":"Did you know that yesterday was the National Ice Cream Day ? ","author":"lemon","img_url":"https://res.cloudinary.com/dkqcbfffd/image/upload/v1753127234/gjglelurzpsufqxkglv9.jpg","date":"2025-07-21T18:09:13.291Z","__v":0,"updated_date":"2025-07-29T00:00:00.000Z"})
    },30000)
})
