const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.use(verifyToken, verifyRole(['STORE_OWNER']));

router.get('/dashboard', storeOwnerController.getDashboard);

module.exports = router;
