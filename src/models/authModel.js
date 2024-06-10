const pool = require("../config/connect");
const { hashPassword, compareHashedPassword } = require("../utils/bcrypt");
const { genOtpCode, otpTimeSpan } = require("../utils/otp");

// smaller helper function
const queryTableBySelect = async (column, whereQuerySearch, value) => await pool.query(`SELECT ${column} FROM person WHERE ${whereQuerySearch} = $1`, [value]);

// queryTableByUpdate
const queryTableByUpdate = async(column, value) => await pool.query(`UPDATE person SET ${column} = $1 WHERE user_id = $2 RETURNING *`, [value[0], value[1]])

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
    const users = await queryTableBySelect('*', 'user_email', email);
    // const users = await verifyUserEmail(email);
    if (users.rows.length === 0) return 'Email is incorrect';

    // PASSWORD CHECK
    const validPassword = await compareHashedPassword(password, users.rows[0].user_password);
    if (!validPassword) return 'incorrect password';

    return users;
}


module.exports = {
    queryTableBySelect,
    queryTableByUpdate,
    registerUser,
    verifyLoginCredentials,
}