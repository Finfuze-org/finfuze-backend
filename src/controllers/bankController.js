
const pool = require("../config/connect")

const addCard = async (req,res) => {
    const {accNo,bank,accName} = req.body
    const userId = req.user.user_id
    console.log("req",userId)
    const cardExist = await pool.query("SELECT account_no,bank_name FROM cards WHERE user_id =$1",[userId])
    console.log("res",cardExist.rows)
    if(cardExist.rows.length > 0 ) return res.status(404).json("account already exist")
    const newCard = await pool.query("INSERT INTO cards (account_no,account_name,bank_name,user_id) VALUES ($1,$2,$3,$4) RETURNING *",[accNo,accName,bank,userId])
    if(newCard.rows.length === 0) return (res.status(404).json("card not added"))
    res.status(201).json({data:newCard.rows[0]})
}

const getCard = async(req,res) => {
    const userId = req.user.user_id
    const cards = await pool.query("SELECT * FROM cards WHERE user_id = $1",[userId])
    if(cards.rows.length === 0) return res.status(404).json("card not found")
    res.status(200).json({data:cards.rows})
}

const updateCard = async (req,res) => {
    const {accNo,accName,bank,credit_card_no,card_expiry_date,CVV} = req.body
    const userId = req.user.user_id
    const card = await pool.query("UPDATE cards SET(account_no,account_name,bank_name,credit_card_n0,card_expiry_date,CVV) VALUES ($1,$2,$3,$4,$5,$6) WHERE user_id=$4 RETURNING *",[accNo,accName,bank,userId,credit_card_no,card_expiry_date,CVV])
    if(card.rows.length === 0) return res.status(404).json("Card not update")
    res.status(201).json({message:'card updated sucessfully',data:card})
}

const deleteCard  = async (req,res) => {
    const {cardId} = req.params
    const userId = req.user.user_id
    const card = await pool.query("DELETE FROM cards WHERE card_id =$1 AND user_id = $2",[cardId,userId])
    if(card.rows.length === 0) return res.status(404).json("There is no card")
    res.status(201).json(`card with id:${cardId} deleted`)
}

module.exports = {
    addCard,
    getCard,
    updateCard,
    deleteCard
}