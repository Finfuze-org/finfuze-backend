const pool = require("../config/connect");
const { hashPassword, compareHashedPassword } = require("../utils/bcrypt");
const { genOtpCode, otpTimeSpan } = require("../utils/otp");

// smaller helper function
const verifyUserEmail = async (email) => await pool.query("SELECT * FROM person WHERE user_email = $1", [email]);  

const getUserOtp = async(id) => {
    return await pool.query("SELECT otp FROM person WHERE user_id = $1", [id])
};

const isUserVerified = async (email) => await pool.query("SELECT is_verified FROM person WHERE user_email = $1", [email]);

// this what i was working on - checks if the user email is verified if not user email would be still accessible for registration
const userVerified = async (user_id) => await pool.query("UPDATE person SET is_verified = $1 WHERE user_id = $2", [true, user_id]); 

const updateTableBy = async(column, value) => await pool.query(`UPDATE person SET ${column} = $1 WHERE user_id = $2`, [value[0], value[1]])

const registerUser = async function(data) {
    const {first_name, last_name, email, password} = data;

    const hashedPassword = await hashPassword(password);
    const otpCode = genOtpCode();
    const otpTime = otpTimeSpan(); 
    const hashedOtpCode = await hashPassword(otpCode);

    // user registration
    const newUser = await pool.query("INSERT INTO person (first_name, last_name, user_email, user_password, otp, otp_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [first_name, last_name, email, hashedPassword, hashedOtpCode, otpTime]);

    console.log(newUser.rows[0]);


    return {
        user: newUser.rows[0],
        otpCode,
    };

}

const verifyLoginCredentials = async ( email, password ) => {
    // EMAIL CHECK
    const users = await verifyUserEmail(email);
    if (users.rows.length === 0) return 'Email is incorrect';

    // PASSWORD CHECK
    const validPassword = await compareHashedPassword(password, users.rows[0].user_password);
    if (!validPassword) return 'incorrect password';

    return users;
}


module.exports = {
    updateTableBy,
    registerUser,
    getUserOtp,
    userVerified,
    isUserVerified,
    verifyLoginCredentials,
}