const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', verifyRole(['USER']), ratingController.addRating);
router.put('/:id', verifyRole(['USER']), ratingController.updateRating);
router.get('/store/:storeId', ratingController.getStoreRatings);

module.exports = router;
