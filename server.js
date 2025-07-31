const connect_db = require("./configs/db")
const app = require("./app")
require('dotenv').config()

const port = process.env.PORT

app.listen(port || 5050, () => {
    console.log("app is listening at port", port)
})

connect_db()