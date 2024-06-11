const express = require("express")
const router = express.Router()
const {auth_user} = require("../middleware/auth")
const {createAccountNo,sendFinzuze,transact} = require("../controllers/transactionController")

router.post("/create",auth_user,createAccountNo)
router.post("/send",sendFinzuze)
router.get("/transact",transact )

module.exports = router