const express = require("express")
const router = express.Router()
const {createUser, verifyUser, login} = require("../controllers/authController");
const loginVerification = require('../middleware/loginVerification');

router.post("/signup", createUser)
router.post("/signup/:userId/verification", verifyUser);
router.use(loginVerification);
router.post('/login', login)


module.exports = router


