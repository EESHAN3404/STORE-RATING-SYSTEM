const db = require('../config/db');

exports.getAllStores = async (req, res) => {
    try {
        const { name = '', email = '', address = '', sort = 'name', order = 'ASC', page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const queryStr = `
            SELECT s.id, s.name, s.email, s.address, s.owner_id, 
                   COALESCE(AVG(r.rating), 0) as average_rating,
                   (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) as user_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.name LIKE ? AND s.email LIKE ? AND s.address LIKE ?
            GROUP BY s.id
            ORDER BY ${sort} ${order}
            LIMIT ? OFFSET ?
        `;
        const userId = req.user ? req.user.id : null;
        const params = [`%${name}%`, `%${email}%`, `%${address}%`];
        const [stores] = await db.query(queryStr, [userId, ...params, Number(limit), Number(offset)]);
        
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM stores WHERE name LIKE ? AND email LIKE ? AND address LIKE ?', params);

        res.json({ stores, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getStoreById = async (req, res) => {
    try {
        const [stores] = await db.query(`
            SELECT s.*, u.name as owner_name 
            FROM stores s
            JOIN users u ON s.owner_id = u.id
            WHERE s.id = ?
        `, [req.params.id]);

        if (stores.length === 0) return res.status(404).json({ message: 'Store not found' });
        res.json(stores[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
