// server/migrations/index.js
const createArenaTables = require('./create_arena_tables');
const createBookingTable = require('./create_booking_table');
const createVouchersTable = require('./vouchers');
const addPinColumn = require('./add_pin_column');

async function runMigrations() {
  try {
    console.log('Starting migrations...');

    // Run migrations in sequence
    await createArenaTables();
    await createBookingTable();
    await createVouchersTable();
    await addPinColumn();

    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

// Export for use in server startup
module.exports = runMigrations;
