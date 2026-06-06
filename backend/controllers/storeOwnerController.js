const db = require('../config/db');

exports.getDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const [stores] = await db.query('SELECT id, name FROM stores WHERE owner_id = ?', [ownerId]);
        if (stores.length === 0) return res.status(404).json({ message: 'No stores found for this owner' });

        const storeId = stores[0].id; // Assuming one store per owner for MVP

        const [[{ averageRating }]] = await db.query('SELECT COALESCE(AVG(rating), 0) as averageRating FROM ratings WHERE store_id = ?', [storeId]);

        const [ratings] = await db.query(`
            SELECT r.id, r.rating, r.created_at, u.name as userName, u.email as userEmail
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
            ORDER BY r.created_at DESC
        `, [storeId]);

        res.json({
            store: stores[0],
            averageRating: Number(averageRating).toFixed(1),
            ratings
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
