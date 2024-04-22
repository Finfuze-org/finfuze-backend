const pool = require("../config/connect");
const { hashPassword } = require("../utils/bcrypt");
const { genOtpCode, otpTimeSpan } = require("../utils/otp");

// smaller helper function
const verifyEmailIsUnique = async (email) => await pool.query("SELECT user_email FROM person WHERE user_email = $1", [email]); // verifyEmailIsUnique - expand later to handle check

const getUserOtp = async(id) => await pool.query("SELECT otp FROM person WHERE user_id = $1", [id])

const registerUser = async function(data) {
    const {first_name, last_name, email, password} = data;

    // verifying user email
    const isEmail = await verifyEmailIsUnique(email);
    if (isEmail.rows.length) return ("Email already exists");

    console.log('was called')

    const hashedPassword = await hashPassword(password);
    const otpCode = genOtpCode();
    const otpTime = otpTimeSpan(); 
    const hashedOtpCode = await hashPassword(otpCode);

    // user registration
    const newUser = await pool.query("INSERT INTO person (first_name, last_name, user_email, user_password, otp, otp_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",[first_name, last_name, email, hashedPassword, hashedOtpCode, otpTime]);


    return {
        user: newUser.rows[0],
        otpCode,
    };

}


module.exports = {
    registerUser,
    getUserOtp,
}