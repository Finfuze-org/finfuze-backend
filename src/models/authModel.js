const pool = require("../config/connect");
const { hashPassword } = require("../utils/bcrypt");
const { genOtpCode, otpTimeSpan } = require("../utils/otp");

// smaller helper function
const verifyEmailIsUnique = (email) => pool.query("SELECT user_email FROM person WHERE user_email = $1", [email]); // verifyEmailIsUnique - expand later to handle check

const registerUser = async function(data) {
    const {first_name, last_name, email, password} = data;
    const isEmail = await pool.query("SELECT user_email FROM person WHERE user_email = $1", [email])
    // const isEmail = verifyEmailIsUnique(email);
    if (isEmail.rows.length) throw new Error("Email already exists");

    const hashedPassword = await hashPassword(password);
    const otpCode = genOtpCode();
    const otpTime = otpTimeSpan(); 
    const hashedOtpCode = await hashPassword(otpCode);

    // user registration
    const newUser = await pool.query("INSERT INTO person (first_name, last_name, user_email, user_password, otp, otp_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",[first_name, last_name, email, hashedPassword, hashedOtpCode, otpTime]);

    // console.log("otpCode ")

    return {
        user: newUser.rows[0],
        otpCode,
    };

}


module.exports = {
    registerUser,
}