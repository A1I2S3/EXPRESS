// middleware/auth.js

const requireRole = (role) => {
    return (req, res, next) => {
        if (!role.includes(req.userRole)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

module.exports = { requireRole };
