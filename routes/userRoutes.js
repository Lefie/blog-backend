const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authenticate = require("../middleware/authenticate")


router.post("/signup", userController.signup)
router.post("/login", userController.login)
router.get("/logout", userController.logout)
router.get("/session", authenticate, userController.testUser)



module.exports = router