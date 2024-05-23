
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied. Admins only.');
    }
    next();
};

module.exports = { authenticateJWT, isAdmin };
