const bcrypt = require("bcrypt")
const updateUser = async (req,res) => {
    const {email,password,firstName,lastName,middleName,birthDate,avatarUrl,contactInfo,contactAddress} = req.body
    const emailExist = await pool.query("SELECT * FROM person WHERE user_email = $1",[email])
    if(emailExist.rows.length === 0) return res.status(404).json("Email does not exist")
    const isMatch = await bcrypt.compare(emailExist.ser_password,password)
    if(!isMatch) return res.status(404).json("password iscorrect")
    const updateUser = await pool.query("UPDATE person SET first_name,last_name,middle_name,birth_date,avatar_url,contact_info,contact_address,user_email VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",[firstName,lastName,middleName,birthDate,avatarUrl,contactInfo,contactAddress,email])
    if(updateUser.rows.length === 0) return res.status(404).json("Failed to update user")
    res.status(201).json({data:updateUser.rows[0]})
}

module.exports = {
    updateUser
}