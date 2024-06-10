require('dotenv').configDotenv()
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET
const exp = process.env.JWT_EXP || '2d';

const tokenPayload = (user)=>{
    return {
        email: user.email,
        userId:user.user_id
    }
}

const createToken = (payload) => {
    return jwt.sign(
        payload, 
        secret, {
            expiresIn: exp
        })
    }
const decodeToken = (token) => {
    return jwt.verify(token, secret)
}

module.exports = {
    tokenPayload,
    createToken,
    decodeToken
}

// const crypto = require('crypto');

// const sss = crypto.randomBytes(32).toString('hex');
// console.log(sss);
