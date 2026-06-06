const bcrypt = require('bcrypt');
const db = require('./config/db');

async function seedUsers() {
    try {
        console.log("Seeding test accounts...");
        const password = await bcrypt.hash('Password@123', 10);
        
        // Check if admin exists
        const [admin] = await db.query("SELECT id FROM users WHERE email='admin@test.com'");
        if (admin.length === 0) {
            await db.query(
                "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
                ['System Administrator Test', 'admin@test.com', password, 'Admin Office', 'ADMIN']
            );
            console.log("Created ADMIN account: admin@test.com / Password@123");
        }

        // Check if store owner exists
        const [owner] = await db.query("SELECT id FROM users WHERE email='owner@test.com'");
        if (owner.length === 0) {
            const [result] = await db.query(
                "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
                ['Store Owner Test Account', 'owner@test.com', password, 'Store Location', 'STORE_OWNER']
            );
            
            // Add a test store for the owner
            await db.query(
                "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
                ['My Awesome Store', 'contact@awesomestore.com', '123 Main St', result.insertId]
            );
            console.log("Created STORE_OWNER account: owner@test.com / Password@123");
        }

        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedUsers();
