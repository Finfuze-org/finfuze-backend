const express = require('express');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET

const auth_user = async function (req, res, next) {
    console.log('<=== IS USER? ===>');
    try {
        const authorization = req.headers.authorization;
        if(!authorization || !authorization.startsWith('Bearer ')){
            return res.status(400).json({
                message: 'Authorization header must start with \'Bearer \'',
                status: 'Failure'
            });
        };
    
        const token = authorization.substring(7);
        const jwtDecode = jwt.verify(token,secret)
        req.user = jwtDecode
        next()

    } catch (error) {
        return res.status(error?.statusCode || 500).send(error?.message || "Unable to authenticate")
    }
}

module.exports = {
    auth_user
}