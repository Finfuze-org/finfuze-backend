const express = require("express")
const router = express.Router()
const {sendFinzuze} = require("../controllers/dashboardController")

router.post("/transact",sendFinzuze)

module.exports = {router}