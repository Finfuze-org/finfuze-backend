const {generateAccountNo} = require("../utils/accountNo")
const {addCard} = require("./bankController")
const pool = require("../config/connect")
const stripe = require("stripe")(process.env.STRIPE_KEYS)


const createAccountNo = async(req,res) => {
    const userId = req.user.user_id
    const finAcc = await generateAccountNo()
    const userExist = await pool.query("SELECT * FROM finfuzeAccount WHERE user_id = $1",[userId])
    if(userExist.rows[0]) return res.status(404).json("user already exists")
    const userAcc = await pool.query("INSERT INTO finfuzeAccount (user_id,account_no,account_type) VALUES ($1,$2,$3) RETURNING *",[userId,finAcc,"finfuze"])
    const {account_no,account_type} =  userAcc.rows[0]
    const {first_name,last_name}  = await pool.query("SELECT first_name, last_name FROM person WHERE user_id =$1",[userId])
    res.status(201).json({data:{username: first_name+" "+last_name,acc:account_no,type:account_type}})
}

const sendFinzuze = async (req,res) => {
    const {receiverAcc, amount, paymentMethod} = req.body
    const userId = req.user.user_id

        try {
            await pool.query("BEGIN")
            if(paymentMethod === "bank"){
                const cardExist = await pool.query("SELECT account_no,bank_name FROM cards WHERE user_id = $1",[userId])
    
                if(cardExist.rows.length === 0) {
                    await pool.query("ROLLBACK")
                    res.status(404).json("card does not exist")
                    }
                    //const addNewCard = addCard(req,res)
                    // if(addNewCard.error){
                    //     await pool.query("ROLLBACK")
                    //     res.status(4040).json(addNewCard.error)
                    // }

                const paymentIntent = await stripe.paymentIntents.create({
                    amount:amount*100,
                    currency:"usd",
                    payment_method_types:["card"],
                    // payment_method_data:{
                    //     type:"card",
                    //     card:"carddetail"
                    // },
                    metadata:{userId,receiverAcc},
                    confirm:true
                })
                if(paymentIntent.status !== "succeded"){
                    await pool.query("ROLLBACK")
                    res.status(404).json("payment failed")
                }
                const receiverExist = await pool.query("SELECT * FROM finfuzeAccount WHERE account_no = $1",[receiverAcc])
                if(receiverExist.rows.length === 0){
                    await pool.query("ROLLBACK")
                    res.status(404).json("receiver account not found")
                }
                await pool.query("UPDATE finfuzeAccount SET balance = balance + $1,income = income + $1 WHERE account_no = $2",[amount,receiverAcc])
            }
            
            else if(paymentMethod === "finfuze"){
                const userIdAcc = await pool.query("SELECT * FROM finfuzeAccount WHERE user_id = $1",[userId])
                const sendIdAcc = await pool.query("SELECT * FROM finfuzeAccount WHERE account_no =$1",[receiverAcc])
                if(!userIdAcc.rows.length === 0 || !sendIdAcc.rows.length === 0) {
                    await pool.query("ROLLBACK");
                    return res.status(404).json("User not found")
                }
                const user = userIdAcc.rows[0]
                const receiver = sendIdAcc.rows[0]
                if(user.balance < amount) {
                    await pool.query("ROLLBACK");
                    return res.status(401).json("insufficient balance")
                }
                const acountWith = user.balance -= amount
                await pool.query("UPDATE finfuzeAccount SET balance = $1, expenses = expenses + $2 WHERE user_id =$3",[acountWith,amount,userId])
                console.log("here")
                await pool.query("UPDATE finfuzeAccount SET balance = balance + $1, income = income + $1 WHERE account_no = $2",[amount,receiverAcc])
            }else{
                await pool.query("ROLLBACK")
                res.status(404).json({data:error.message})
            }
    
    
            const transaction = await pool.query("INSERT INTO transaction_history (amount,transact_status,transact_type,payment_method,receiver_id,user_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",[amount,'Pending','expense',paymentMethod,receiverAcc,userId])
            if(!transaction.rowCount === 0) {
                await pool.query("ROLLBACK");
                return res.status(404).json("transaction failed")
            }
            await pool.query("COMMIT")
            res.status(201).json("transaction successful")  
        } catch (error) {
            await pool.query("ROLLBACK")
            res.status(404).json(error.message)
        }
    }

const getTransaction = async (req,res) => {
    const userId = req.user.user_id
    const userTransact =  await pool.query("SELECT * FROM transaction_history WHERE user_id = $1",[userId])
    if(userTransact.rows.length === 0) return res.status(404).json("transaction not found")
    res.status(202).json({data:userTransact.rows})
}

const getSingleTransaction = async(req,res) => {
    const userId = req.user.user_id
    const receiverId = req.params.id;
    const transact = await pool.query("SELECT * FROM transaction_history WHERE user_id = $1 AND transact_id = $2",[userId,receiverId])
    if(transact.rows.length === 0) return res.status(404).json("transaction not found")
    res.status(202).json({data:transact.rows[0]})
}

const addBeneficiary = async (req,res) => {
    const userId = req.user.user_id
    const beneId = req.params.id;
    const userExist = await pool.query("SELECT * FROM saveBeneficiary WHERE transaction_history_id = $1",[beneId])
    if(userExist.rows.length > 0) return res.status(404).json("user already exist")
    const transactId = await pool.query("SELECT * FROM transaction_history WHERE user_id =$1 AND transact_id = $2",[userId,beneId])
    if(transactId.rows.length === 0) return res.status(404).json("beneficiary not added")
    const addBene = await pool.query("INSERT INTO saveBeneficiary (transaction_history_id) VALUES ($1) RETURNING *",[beneId])
    res.status(201).json({msg:"beneficiary added successfully",data:addBene.rows[0]})
}

const removeBeneficiary = async (req,res) => {
    const beneId = req.params.id;
    const delUser = await pool.query("DELETE FROM saveBeneficiary WHERE transaction_history_id = $1",[beneId])
    if(delUser.rows.length > 0) return res.status(404).json('failed to delete')
    res.status(202).json("beneficiary removed")
}

module.exports = {
    sendFinzuze,
    createAccountNo,
    getTransaction,
    getSingleTransaction,
    addBeneficiary,
    removeBeneficiary
}