
const { queryTableByUpdate, verifyLoginCredentials } = require('../models/authModel');
const { genOtpCode } = require('../utils/otp');
const { optMessage } = require('../utils/emailTemplates');
const { hashPassword } = require('../utils/bcrypt');

const loginVerification = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const response = await verifyLoginCredentials(email, password);

        // Error handling - invalid login credentials
        if (typeof response === 'string') return res.status(401).json({
            error: true,
            message : 'Incorrect user input, kindly check and try again or signup to login'
        }); 

        if (!response.rows[0].is_verified) {
            const { user_email: email } = response.rows[0];
            console.log("res",response.rows[0])
            const otpCode = genOtpCode();
            const hashedOtp = await hashPassword(otpCode);

            console.log(hashedOtp);

            await queryTableByUpdate('otp', [hashedOtp, response.rows[0].user_id]);
          
            await optMessage(email, otpCode);
        
            return res.status(403).json({
                user_id: response.rows[0].user_id,
                message: 'User is not verified, authenticate account with otp sent to your mail',
            });
        }
        console.log("reqLog",req.user)
        req.user = response.rows[0];

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json(`Something went wrong, kindly contact admin via ${process.env.SMTP_USER}`);
    }
}

module.exports = loginVerification;