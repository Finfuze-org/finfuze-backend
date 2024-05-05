const express = require("express")
const router = express.Router()
const {createUser, verifyUser, login} = require("../controllers/authController");
const loginVerification = require('../middleware/loginVerification');

router.post("/signup", createUser)
router.post("/signup/:userId/verification", verifyUser);
router.use(loginVerification);
router.post('/login', login)


module.exports = router

/**
 * implement a middleware that checks the user verifications 
 * if verified next();
 * if !verified return send otp mail and return user_id and message to verify before redirecting to login route
 */