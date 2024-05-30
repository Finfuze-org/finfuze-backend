const sendFinzuze = async (req,res) => {
    const {finzuzeId,receiverId, amount, type,description} = req.body
    try {
        await pool.query("BEGIN")
        const userId = await pool.query("SELECT * FROM account WHERE user_id = $1",[finzuzeId])
        const sendId = await pool.query("SELECT * FROM account WHERE user_id =$1",[receiverId])
        if(!userId.rows.length === 0 || !sendId.rows.length === 0) return res.status(404).json("User not found")
        const user = userId.rows[0]
        const receiver = sendId.rows[0]
        if(user.balance < amount) return res.status(401).json("insufficient balance")
        const acountWith = user.balance -= amount
        const acountSen = receiver.balance += amount
        await pool.query("UPDATE account SET balance = $1 WHERE user_id =$2",[acountWith,finzuzeId])
        await pool.query("UPDATE account SET balance = $1 WHERE user_id = $2",[acountSen,receiverId])
        const transaction = await pool.query("INSERT INTO transaction_history VALUE =$1,$2,$3,$4,$5 WHERE user_id = $6 RETURNING *",[amount,'pending','expenses','card transfer',receiverId,finzuzeId])
        if(!transaction.rowCount === 0) return res.status(404).json("transaction failed")
        await pool.query("COMMIT")
        res.status(201).json("transaction successful") 
    } catch (error) {
        await pool.query("ROLLBACK")
        res.status(404).json({data:error.message})
    }
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