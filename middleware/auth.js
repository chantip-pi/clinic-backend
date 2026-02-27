const jwt = require('jsonwebtoken');

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = (req.body && req.body.token) || req.query.token || req.headers['x-access-token'] || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = verifyToken;