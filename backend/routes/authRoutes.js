const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
