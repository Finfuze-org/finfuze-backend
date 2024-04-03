const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const pool = require("../config/connect")
const sendMail = require("../config/emailer")
const otp = require("../utils/otp")
const errors = require("../errors/badRequest")

const createUser = async (req,res) => {
    console.log("here")
    const {first_name,last_name,email, password} = req.body
    const isEmail = await pool.query("SELECT user_email FROM person WHERE user_email = $1",[email])
    if(isEmail.rows.length) return res.status(401).json("Email already exists")
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const otpCode = otp().toString()
    const otpTime = new Date(Date.now() + 1800000)
    const hashedOtpCode = await bcrypt.hash(otpCode, salt)
    console.log("email",email)
    const newUser = await pool.query("INSERT INTO person (first_name,last_name,user_email,user_password,otp,otp_time) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",[first_name,last_name,email,hashedPassword,hashedOtpCode,otpTime])
    const message  =`<p>Please enter ${otpCode} to verify email and complete sign up.</p>
        <p>This code <b>expires in 30 minutes.</b></p> 
         <p>Press <a href="${process.env.CLIENT_URL}">here</a> to proceed.</p>                                                               
         `;
    const subject = "OTP VERIFICATION"
    await sendMail(email,subject,message)
    res.status(201).json({user:newUser.rows[0]})
}

module.exports = {
    createUser
}