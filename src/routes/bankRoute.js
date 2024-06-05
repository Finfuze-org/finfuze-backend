const express = require('express')
const router = express.Router()
const {addCard,getCard,updateCard,deleteCard} = require("../controllers/bankController")

router.post("/add",addCard)
router.get("/",getCard)
router.put("/",updateCard)
router.delete("/:cardId",deleteCard)

module.exports = router