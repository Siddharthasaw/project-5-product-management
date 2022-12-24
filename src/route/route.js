const express = require("express")
const router = express.Router()
const userController = require("../user/userController")
const middleware = require("../middleware/auth")

router.post("/register",userController.createUser)
router.post("/loginUser",userController.loginUser)
router.get("/getUser/:userId", middleware.authentication,userController.getUser)
router.put('/user/:userId/profile',middleware.authentication,middleware.autherization, userController.updateProfile)


module.exports = router
