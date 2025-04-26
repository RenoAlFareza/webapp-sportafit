// server/migrations/add_social_login_columns.js
const db = require('../db');

async function addSocialLoginColumns() {
  try {
    // Koneksi ke database
    await db.authenticate();
    console.log('Database connection established successfully.');

    // Cek apakah kolom google_id sudah ada
    try {
      await db.query('SELECT google_id FROM users LIMIT 1');
      console.log('Column google_id already exists.');
    } catch (error) {
      // Jika error, berarti kolom belum ada
      console.log('Adding google_id column...');
      await db.query('ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL');
      console.log('Column google_id added successfully.');
    }

    // Cek apakah kolom facebook_id sudah ada
    try {
      await db.query('SELECT facebook_id FROM users LIMIT 1');
      console.log('Column facebook_id already exists.');
    } catch (error) {
      // Jika error, berarti kolom belum ada
      console.log('Adding facebook_id column...');
      await db.query('ALTER TABLE users ADD COLUMN facebook_id VARCHAR(255) NULL');
      console.log('Column facebook_id added successfully.');
    }

    // Cek apakah kolom twitter_id sudah ada
    try {
      await db.query('SELECT twitter_id FROM users LIMIT 1');
      console.log('Column twitter_id already exists.');
    } catch (error) {
      // Jika error, berarti kolom belum ada
      console.log('Adding twitter_id column...');
      await db.query('ALTER TABLE users ADD COLUMN twitter_id VARCHAR(255) NULL');
      console.log('Column twitter_id added successfully.');
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Jalankan migrasi
addSocialLoginColumns();
