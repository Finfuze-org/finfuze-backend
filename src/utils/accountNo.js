const generateAccountNo = async () =>{
    let accNo;
    let unique = false;
    while(!unique){
        accNo = Math.floor(1000000000 + Math.random()*9000000000).toString()
        const existingUser = await pool.query("SELECT * FROM finfuzeAccount WHERE account_no =$1",[accNo])
        if(!existingUser){
            unique = true
        }
        return accNo
    }   
}

module.exports = {generateAccountNo}