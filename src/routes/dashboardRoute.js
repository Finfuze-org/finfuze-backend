const express = require("express")
const router = express.Router()
const {sendFinzuze,transact} = require("../controllers/dashboardController")

router.post("/send",sendFinzuze)
router.get("/transact",transact )

module.exports = router