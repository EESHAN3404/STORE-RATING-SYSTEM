const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validatePasswordChange } = require('../middleware/validationMiddleware');

router.use(verifyToken);

router.get('/', verifyRole(['ADMIN']), userController.getAllUsers);
router.get('/:id', verifyRole(['ADMIN']), userController.getUserById);
router.put('/change-password', validatePasswordChange, userController.changePassword);

module.exports = router;
