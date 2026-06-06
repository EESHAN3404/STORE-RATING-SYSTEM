const db = require('../config/db');

exports.addRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        const user_id = req.user.id;

        if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

        const [existing] = await db.query('SELECT id FROM ratings WHERE user_id = ? AND store_id = ?', [user_id, store_id]);
        if (existing.length > 0) return res.status(400).json({ message: 'You have already rated this store' });

        await db.query('INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)', [user_id, store_id, rating]);

        res.status(201).json({ message: 'Rating submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateRating = async (req, res) => {
    try {
        const { rating } = req.body;
        const user_id = req.user.id;
        const store_id = req.params.id;

        if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

        const [result] = await db.query('UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?', [rating, user_id, store_id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Rating not found' });

        res.json({ message: 'Rating updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getStoreRatings = async (req, res) => {
    try {
        const [ratings] = await db.query(`
            SELECT r.id, r.rating, r.created_at, u.name as user_name, u.email as user_email
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
        `, [req.params.storeId]);

        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
