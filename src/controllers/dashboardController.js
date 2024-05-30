const sendFinzuze = async (req,res) => {
    const {finzuzeId,receiverId, amount, type,description} = req.body
    const userId = await pool.query("SELECT * FROM account WHERE user_id = $1",[finzuzeId])
    const sendId = await pool.query("SELECT * FROM account WHERE user_id =$1",[receiverId])
    if(!userId || !sendId) return res.status(404).json("User not found")
    if(userId.balance < amount) return res.status(401).json("insufficient balance")
    const acountWith = userId.balance -= amount
    await pool.query("UPDATE account SET balance = $1 WHERE user_id =$2",[acountWith,finzuzeId])
    const acountSen = sendId.balance += amount
    await pool.query("UPDATE account SET balance = $1 WHERE user_id = $2",[receiverId])
    const transaction = await pool.query("INSERT INTO transaction_history VALUE =$1,$2,$3,$4,$5 WHERE user_id = $6 RETURNING *",[amount,'pending','expenses','card transfer',receiverId,finzuzeId])
    if(!transaction.rowCount) return res.status(404).json("transaction failed")
    res.status(201).json("transaction successful") 
}
const transact = async(req,res) => {
    const {userId} = req.body
    const user = await pool.query("SELECT * FROM transaction_history WHERE user_id = $1",[userId])
    if(!user.length.rowCount) return res.status(404).json({data:"user not found"})
    res.status(200).json({data:user.rows})
}
module.exports = {
    sendFinzuze,
    transact
}