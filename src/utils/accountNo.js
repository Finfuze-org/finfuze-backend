const pool = require("../config/connect")

const generateAccountNo = async () =>{
    let accNo;
    let unique = false;
    while(!unique){
        accNo = Math.floor(1000000000 + Math.random()*9000000000).toString()
        console.log("cc",typeof(accNo))
        const existingUser = await pool.query("SELECT account_no FROM finfuzeAccount WHERE account_no =$1",[accNo])
        console.log("accNo",existingUser.rows)
        if(!existingUser){
            unique = true
        }
        return accNo
    }   
}

module.exports = {generateAccountNo}