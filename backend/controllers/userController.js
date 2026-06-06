const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const { name = '', email = '', address = '', role = '', sort = 'name', order = 'ASC', page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const queryStr = `
            SELECT id, name, email, address, role, created_at 
            FROM users 
            WHERE name LIKE ? AND email LIKE ? AND address LIKE ? AND role LIKE ?
            ORDER BY ${sort} ${order}
            LIMIT ? OFFSET ?
        `;
        const params = [`%${name}%`, `%${email}%`, `%${address}%`, `%${role}%`];
        const [users] = await db.query(queryStr, [...params, Number(limit), Number(offset)]);
        
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM users WHERE name LIKE ? AND email LIKE ? AND address LIKE ? AND role LIKE ?', params);

        res.json({ users, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, address, role, created_at FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const user = users[0];

        if (user.role === 'STORE_OWNER') {
            const [stores] = await db.query(`
                SELECT s.name, s.address, COALESCE(AVG(r.rating), 0) as average_rating 
                FROM stores s
                LEFT JOIN ratings r ON s.id = r.store_id
                WHERE s.owner_id = ?
                GROUP BY s.id
            `, [user.id]);
            user.stores = stores;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const [users] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, users[0].password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
