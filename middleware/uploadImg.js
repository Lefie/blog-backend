const multer = require("multer")

const storage = multer.memoryStorage() // ref: doc. The memory storage engine stores the files in memory as Buffer objects. 
const upload = multer({storage:storage})
module.exports = upload