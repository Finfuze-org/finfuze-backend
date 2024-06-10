const { compareHashedPassword } = require('../utils/bcrypt');
const { optMessage } = require("../utils/emailTemplates") 
const { createToken } = require('../utils/jwt')
const { registerUser, queryTableBySelect, queryTableByUpdate } = require('../models/authModel');

// const errors = require("../errors/badRequest")

const createUser = async (req, res) => {

    try {
        const userData = req.body;
        const { email } = req.body;
        const response = await registerUser(userData);
        
        const { otpCode, user } = response;
        
        await optMessage(email, otpCode); // dev mode - needs internet connection else, it'll return a timeout error
        // TODO: prevent mail from being sent to an invalid mail
        
        return res.status(201).json({ 
            user_id: user.user_id,
            message: 'Authenticate your email to complete registration'
         })
        
    } catch (error) {
        console.log(error);
        if (error.code === '23505') {
            return res.status(400).json({
                error: true,
                message: 'An account with this email already exists, login to complete signup, or please check your details and try again'
            });
        }

        if (error.message === "Error: queryA ETIMEOUT smtp.gmail.com") {
            res.status(400).json({
                error: true,
                message: `Connection timeout, kindly check your network connection`
    
            })
        }

        res.status(500).json({
            error: true,
            message: ` Something went wrong, kindly contact admin via ${process.env.SMTP_USER}`,
            serverMessage: error.message,
        })
    }

}



const verifyUser = async (req, res) => {
    try {
        const { otp } = req.body;
        const { userId } = req.params;
        
        const userDetails = await queryTableBySelect('otp', 'user_id', userId);
        const { otp: hashedOtp} = userDetails.rows[0];
        
        const result = await compareHashedPassword(otp, hashedOtp);
        
        if (result === false) return res.status(401).json({message: 'otp is incorrect'});
        
        await queryTableByUpdate('is_verified', [true, userId])
    
        return res.status(200).json({message: 'Authenticated'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: ` Something went wrong, kindly contact admin via ${process.env.SMTP_USER}`,
            serverMessage: error.message,
        })
    }
}


const login = async (req, res) => {
    try{
        // Generate JWT token
        // omitting sensitive info from payload
        console.log("req")
        console.log("req",req.user)
        const {user_password, otp , ...payload} = req.user;
        const token = createToken(payload); 

        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: true,
            message: `Something went wrong, kindly contact admin via ${process.env.SMTP_USER}`,
        });
    }

    }

module.exports = {
    createUser,
    verifyUser,
    login
}