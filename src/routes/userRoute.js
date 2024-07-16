const express = require("express")
const router = express.Router()
const {updateUser} = require("../controllers/userController")
const {upload} = require("../middleware/multer")

router.put("/profile", upload.single("image"),updateUser)

module.exports = router