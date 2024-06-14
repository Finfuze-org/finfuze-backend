const express = require('express')
const router = express.Router()
const {auth_user} = require("../middleware/auth")
const {addCard,getCard,updateCard,deleteCard} = require("../controllers/bankController")

router.post("/add",auth_user,addCard)
router.get("/",auth_user,getCard)
router.put("/",auth_user,updateCard)
router.delete("/:cardId",auth_user,deleteCard)

module.exports = router