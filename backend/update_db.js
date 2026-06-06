const db = require('./config/db');

async function updateRecords() {
    try {
        console.log("Updating records...");
        
        // Update user
        await db.query(
            "UPDATE users SET name = 'eeshan kurhe', address = 'near market yard pune' WHERE email = 'owner@test.com'"
        );
        console.log("User updated successfully!");

        // Update store
        await db.query(
            "UPDATE stores SET email = 'shreekirana@gmail.com', address = 'near market yard' WHERE name = 'shree kirana store'"
        );
        console.log("Store updated successfully!");

        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateRecords();
