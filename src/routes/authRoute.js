const express = require("express")
const router = express.Router()
const {createUser} = require("../controllers/authController")

router.post("/signup", createUser)
// router.post('/signup/otp/emailVerification', verifyUser);


module.exports = router

/**
 * /signup/:userId/otpVerification
 */