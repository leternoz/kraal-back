const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('./config');

const ROUNDS = 10;

/**
 * Hash plain text password into a hashed password bcrypt 
 * @param {*} passwordToHash 
 */
const hashPassword = async (passwordToHash) => {
    try {
        return bcrypt.hash(passwordToHash, ROUNDS); 
    } catch(e) {
        console.error(e);
    }
};

/**
 * Compare an unhasshed password with a hashed password, return true if they match
 * @param {*} passwordToCompare 
 * @param {*} hash 
 */
const comparePassword = (passwordToCompare, hash) => {
    try {
        return bcrypt.compare(passwordToCompare, hash)
    } catch(e) {
        console.error(e);
    }
}

const generateAccessToken = (payload) => {
    return jwt.sign({data: payload}, config.tokenSecret, {expiresIn: config.tokenExpiresIn})
}

const getTokenFromReq = (req) => {
    const tokenWithBearer = req.headers.authorization || '';
    return token = tokenWithBearer.replace('Bearer ', '');
};

/**
 * 
 * @param {*} req, the request with the token, and the user in the payload
 */
const getDataFromReqToken = (req) => {
    const token = getTokenFromReq(req);
    if(token) {
        return jwt.decode(token).data;
    }
    return null;
};



module.exports = { hashPassword, comparePassword, generateAccessToken, getDataFromReqToken };