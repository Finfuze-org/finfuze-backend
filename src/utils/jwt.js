require('dotenv').configDotenv()
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET
const exp = process.env.JWT_EXP || '2d';

const tokenPayload = (user)=>{
    return {
        email: user.email
    }
}

const createToken = ({payload}) => {
    return jwt.sign(
        payload, 
        secret, {
            expiresIn: exp
        })
    }
const decodeToken = (token) => {
    return jwt.verify(token, secret)
}

module.export = {
    tokenPayload,
    createToken,
    decodeToken
}