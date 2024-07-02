const express = require("express")
const router = express.Router()
const {createUser, verifyUser, login} = require("../controllers/authController");
const loginVerification = require('../middleware/loginVerification');
const {updateUser} = require("../controllers/userController")
const {upload} = require("../middleware/multer")

router.post("/signup", createUser)
router.post("/signup/:userId/verification", verifyUser);
router.use(loginVerification);
router.post('/login', login)
router.put("/profile",upload.single("image"),updateUser)


module.exports = router


