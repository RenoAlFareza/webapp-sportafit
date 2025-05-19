// server/migrations/add_pin_column.js
const db = require('../db');

async function addPinColumn() {
  try {
    // Koneksi ke database
    await db.authenticate();
    console.log('Database connection established successfully.');

    // Cek apakah kolom pin sudah ada
    try {
      await db.query('SELECT pin FROM users LIMIT 1');
      console.log('Column pin already exists.');
    } catch (error) {
      // Jika error, berarti kolom belum ada
      console.log('Adding pin column...');
      await db.query('ALTER TABLE users ADD COLUMN pin VARCHAR(255) NULL');
      console.log('Column pin added successfully.');
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

module.exports = addPinColumn;
