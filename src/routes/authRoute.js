const express = require("express")
const router = express.Router()
const {createUser, verifyUser, login} = require("../controllers/authController")

router.post("/signup", createUser)
router.post("/signup/:userId/verification", verifyUser);
router.post('/login', login)


module.exports = router

