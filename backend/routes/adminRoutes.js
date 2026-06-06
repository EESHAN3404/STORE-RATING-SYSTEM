const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateRegister } = require('../middleware/validationMiddleware');

router.use(verifyToken, verifyRole(['ADMIN']));

router.get('/dashboard', adminController.getDashboardStats);
router.post('/users', validateRegister, adminController.addUser);
router.post('/stores', adminController.addStore);

module.exports = router;
