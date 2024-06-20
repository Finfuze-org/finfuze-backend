const express = require("express")
const router = express.Router()
const {auth_user} = require("../middleware/auth")
const {createAccountNo,sendFinzuze,transact,getTransaction,getSingleTransaction,addBeneficiary,removeBeneficiary} = require("../controllers/transactionController")

router.post("/create",auth_user,createAccountNo)
router.post("/send",auth_user,sendFinzuze)
router.get("/transact",transact )
router.get("/",auth_user,getTransaction);
router.get("/:id",auth_user,getSingleTransaction)
router.post("/:id",auth_user,addBeneficiary)
router.delete("/:id",auth_user,removeBeneficiary)

module.exports = router