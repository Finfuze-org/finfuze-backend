const sendFinzuze = async (req,res) => {
    const {finzuzeId, amount, type,description} = req.body
    const userId = await pool.query("SELECT user_id FROM person")
    if(!userId) return res.status(404).json("User not found")
        if(type === 'debit')
}