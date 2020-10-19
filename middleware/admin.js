const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function admin(req, res, next) {
    // 401 - Unauthorized
    // 403 - Forbidden
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');

    next();
}