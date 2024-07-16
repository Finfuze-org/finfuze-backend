const bcrypt = require("bcrypt")
const pool = require("../config/connect")
const cloudinary = require("../config/cloudinary")

const updateUser = async (req,res) => {
    console.log("here")
    const {email,password,firstName,lastName,middleName,birthDate,contactInfo,contactAddress} = req.body
   console.log("here")
    const result = await cloudinary.uploader.upload(req.file.path,{resource_type:"image"})
        
        console.log("here")
        const {url, public_id} = result;
        console.log("here",url,public_id)
    const emailExist = await pool.query("SELECT * FROM person WHERE user_email = $1",[email])
    if(emailExist.rows.length === 0) return res.status(404).json("Email does not exist")
    console.log("here",emailExist.rows[0])
    const isMatch = await bcrypt.compare(password,emailExist.rows[0].user_password)
    if(!isMatch) return res.status(404).json("password iscorrect")
    console.log("here1")
    const updateUser = await pool.query("UPDATE person SET first_name = $1,last_name = $2,middle_name = $3,birth_date = $4,avatar_url = $5,contact_info = $6,contact_address = $7 WHERE user_email = $8 RETURNING *",[firstName,lastName,middleName,birthDate,url,contactInfo,contactAddress,email])
    if(updateUser.rows.length === 0) return res.status(404).json("Failed to update user")
    res.status(201).json({data:updateUser.rows[0]})
    
}

module.exports = {
    updateUser
}