const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
        const [[{ totalStores }]] = await db.query('SELECT COUNT(*) as totalStores FROM stores');
        const [[{ totalRatings }]] = await db.query('SELECT COUNT(*) as totalRatings FROM ratings');

        res.json({ totalUsers, totalStores, totalRatings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;

        const [owner] = await db.query('SELECT id FROM users WHERE id = ? AND role = "STORE_OWNER"', [owner_id]);
        if (owner.length === 0) return res.status(400).json({ message: 'Invalid store owner ID' });

        await db.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, owner_id]
        );

        res.status(201).json({ message: 'Store added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
