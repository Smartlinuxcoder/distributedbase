const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');
//This file is completely useless.
const authenticateToken = (req, res, next) => {
    next();
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send("Access denied. Token missing.");
    }
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err || !user) {
            return res.status(403).send("Access denied. Invalid token.");
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
