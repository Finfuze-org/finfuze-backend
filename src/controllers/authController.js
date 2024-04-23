const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { compareHashedPassword } = require('../utils/bcrypt');
const pool = require("../config/connect")
const sendMail = require("../config/emailer")
const { otp, } = require("../utils/otp")
const errors = require("../errors/badRequest")
const { createToken } = require('../utils/jwt')

const { registerUser, getUserOtp, verifyLoginCredentials } = require('../models/authModel');

const createUser = async (req, res) => {

    try {
        const userData = req.body;
        const { email } = req.body;
        const response = await registerUser(userData);

        // Error handling - if email already exists
        if (typeof response === 'string') return res.status(400).json({message: response})
        
        const { otpCode, user } = response;
        
        // email messaging - frontend to provide url for CLIENT_URL
        const message  =`<p>Please enter ${otpCode} to verify email and complete sign up.</p>
            <p>This code <b>expires in 30 minutes.</b></p> 
             <p>Press <a href="${process.env.CLIENT_URL}">here</a> to proceed.</p>                                                               
             `;
        const subject = "OTP VERIFICATION";
        await sendMail(email, subject, message)
        console.log('done')

        res.status(201).json({ 
            user_id: user.user_id,
            message: 'Authenticate your email to complete registration'
         })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: `Internal server error, kindly contact admin via ${process.env.SMTP_USER}`})
    }

}

const verifyUser = async(req, res) => {
    const { otp } = req.body;
    const { userId } = req.params;
    
    const userDetails = await getUserOtp(+userId);
    const { otp: hashedOtp} = userDetails.rows[0]; 

    const result = await compareHashedPassword(otp, hashedOtp);
    
    if (result === 'false') return res.status(401).json({message: 'otp is incorrect'})

    return res.status(200).json({message: 'Authenticated'})
}

const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const response = await verifyLoginCredentials(email, password);

        // Error handling - invalid login credentials
        if (typeof response === 'string') return res.status(401).json({error : response}); 
        
        // Generate JWT token
        // omitting sensitive info from payload
        const {user_password, otp , ...payload} = response.rows[0];
        const token = createToken(payload); // Assuming createToken function is defined elsewhere

        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Internal server error, kindly contact admin via ${process.env.SMTP_USER}` });
    }

    }

module.exports = {
    createUser,
    verifyUser,
    login
}