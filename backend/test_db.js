const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log("SUCCESS: Connected to the database.");
        await connection.end();
    } catch (err) {
        console.error("ERROR:", err.message);
    }
}

testConnection();
