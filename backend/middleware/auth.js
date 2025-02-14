const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
    // Convert roles to an array if not provided
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        // Get token from headers
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Check user roles
            if (roles.length && !roles.includes(req.user.userType)) {
                return res.status(403).json({ message: 'Access denied.' });
            }

            next(); // Proceed to next middleware or route
        } catch (error) {
            res.status(401).json({ message: 'Token is not valid' });
        }
    };
};

module.exports = auth;
