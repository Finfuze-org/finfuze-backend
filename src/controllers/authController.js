const { compareHashedPassword } = require('../utils/bcrypt');
const { optMessage } = require("../utils/emailTemplates") 
const { createToken } = require('../utils/jwt')
const { registerUser, getUserOtp, verifyLoginCredentials } = require('../models/authModel');

// const errors = require("../errors/badRequest")

const createUser = async (req, res) => {

    try {
        const userData = req.body;
        const { email } = req.body;
        const response = await registerUser(userData);
        
        
        const { otpCode, user } = response;
        
        await optMessage(email, otpCode); // dev mode - needs internet connection else, it'll return a timeout error
        
        res.status(201).json({ 
            user_id: user.user_id,
            message: 'Authenticate your email to complete registration'
         })
        
    } catch (error) {
        if (error.code === '23505') return res.status(400).json({
            error: true,
            message: 'An account with this email already exists, please check and try again'
        });
        res.status(500).json({
            error: true,
            message: ` Something went wrong, kindly contact admin via ${process.env.SMTP_USER}`,
            serverMessage: error.message,
        })
    }

}

const verifyUser = async(req, res) => {
    const { otp } = req.body;
    const { userId } = req.params;
    
    const userDetails = await getUserOtp(+userId);
    const { otp: hashedOtp} = userDetails.rows[0]; 

    const result = await compareHashedPassword(otp, hashedOtp);
    
    if (result === 'false') return res.status(401).json({message: 'otp is incorrect'});

    // const res = userVerified();

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