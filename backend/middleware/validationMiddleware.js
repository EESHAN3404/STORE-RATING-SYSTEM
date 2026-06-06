const { body, validationResult } = require('express-validator');

const validateRegister = [
    body('name')
        .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
    body('address').optional().isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validatePasswordChange = [
    body('newPassword')
        .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateRegister, validateLogin, validatePasswordChange };
