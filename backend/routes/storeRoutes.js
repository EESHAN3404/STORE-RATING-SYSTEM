const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', storeController.getAllStores);
router.get('/:id', storeController.getStoreById);

module.exports = router;
