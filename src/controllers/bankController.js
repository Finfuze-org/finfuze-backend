

const addCard = async (req,res) => {
    const {accNo,bank,accName} = req.body
    const newCard = await pool.query("INSERT INTO cards (account_no,account_name,bank_name) VALUES ($1,$2,$3) RETURNING *",[accNo,accName,bank])
    if(!newCard.rows.length === 0) return (res.status(404).json("card not added"))
    res.status(201).json({data:newCard.rows[0]})
}

const getCard = async(req,res) => {
    const userId = req.user.id
    const cards = await pool.query("SELECT * FROM cards WHERE user_id = $1",[userId])
    if(!cards.rows.length === 0) return res.status(404).json("card not found")
    res.status(200).json({data:cards.rows})
}

const updateCard = async (req,res) => {
    const {accNo,accName,bank} = req.body
    const userId = req.user.id
    const card = await pool.query("UPDATE cards SET(account_no,account_name,bank_name) VALUES ($1,$2,$3) WHERE user_id=$4 RETURNING *",[accNo,accName,bank,userId])
    if(!card.rows.length === 0) return res.status(404).json("Card not update")
    res.status(201).json({message:'card updated sucessfully',data:card})
}

const deleteCard  = async (req,res) => {
    const {cardId} = req.params
    const card = await pool.query("DELETE FROM cards WHERE card_id =$1")
    if(!card.rows.length === 0) return res.status(404).json("Fail to delete")
    res.status(201).json(`card with id:${cardId} deleted`)
}

module.exports = {
    addCard,
    getCard,
    updateCard,
    deleteCard
}