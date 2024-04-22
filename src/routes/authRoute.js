const express = require("express")
const router = express.Router()
const {createUser, verifyUser} = require("../controllers/authController")

router.post("/signup", createUser)
router.post("/signup/:userId/verification", verifyUser);


module.exports = router

/**
 * /signup/:userId/otpVerification
// router.post('/signup/otp/emailVerification', verifyUser);
 */