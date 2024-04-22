const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { hashPassword, } = require('../utils/bcrypt');
const pool = require("../config/connect")
const sendMail = require("../config/emailer")
const { otp, } = require("../utils/otp")
const errors = require("../errors/badRequest")

const { registerUser } = require('../models/authModel');

const createUser = async (req, res) => {

    try {
        const userData = req.body;
        const { email } = req.body;
        const response = await registerUser(userData);

        // Error handling - if email already exists
        if (typeof response === 'string') return res.status(401).json({message: response})
        
        const { otpCode, user } = response;
        
        const message  =`<p>Please enter ${otpCode} to verify email and complete sign up.</p>
            <p>This code <b>expires in 30 minutes.</b></p> 
             <p>Press <a href="${process.env.CLIENT_URL}">here</a> to proceed.</p>                                                               
             `;
        const subject = "OTP VERIFICATION";
        await sendMail(email, subject, message)
        console.log('done')
        res.status(201).json({ message: 'Authenticate your email to complete registration' })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error. Kindly contact webpage admin.'})
    }

}

// const verifyUser = async(req, res) => {
//     const code = req.body;
//     const user = req.params;
    
//     console.log({code, user})

//     return res.status(200).json({message: 'Authenticated'})
// }

module.exports = {
    createUser,
    // verifyUser,
}