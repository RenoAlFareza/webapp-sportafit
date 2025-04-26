// server/migrations/create_booking_table.js
const db = require('../db');

async function createBookingTable() {
  try {
    console.log('Starting migration: create_booking_table');
    
    // Cek apakah tabel bookings sudah ada
    try {
      await db.query('SELECT 1 FROM bookings LIMIT 1');
      console.log('Table bookings already exists.');
    } catch (error) {
      // Jika error, berarti tabel belum ada
      console.log('Creating bookings table...');
      await db.query(`
        CREATE TABLE bookings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          court_id INT NOT NULL,
          booking_date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          total_price INT NOT NULL,
          status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
          payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
          invoice_number VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (court_id) REFERENCES courts(id)
        )
      `);
      console.log('Table bookings created successfully.');
      
      // Insert sample data
      console.log('Inserting sample data into bookings...');
      
      // Get a user ID
      const [users] = await db.query('SELECT id FROM users LIMIT 1');
      if (users.length === 0) {
        console.log('No users found. Skipping sample booking data.');
        return;
      }
      const userId = users[0].id;
      
      // Get court IDs
      const [courts] = await db.query('SELECT id FROM courts LIMIT 5');
      if (courts.length === 0) {
        console.log('No courts found. Skipping sample booking data.');
        return;
      }
      
      // Generate sample bookings
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      
      // Format dates for MySQL
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };
      
      // Generate invoice numbers
      const generateInvoiceNumber = () => {
        const date = today.getFullYear().toString().substr(-2) + 
                    (today.getMonth() + 1).toString().padStart(2, '0') + 
                    today.getDate().toString().padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        const suffix = Math.floor(Math.random() * 90 + 10);
        return `INV-${date}-${random}-${suffix}`;
      };
      
      const invoice1 = generateInvoiceNumber();
      const invoice2 = generateInvoiceNumber();
      
      await db.query(`
        INSERT INTO bookings (user_id, court_id, booking_date, start_time, end_time, total_price, status, payment_status, invoice_number)
        VALUES 
        (${userId}, ${courts[0].id}, '${formatDate(tomorrow)}', '10:00:00', '11:00:00', 80000, 'confirmed', 'paid', '${invoice1}'),
        (${userId}, ${courts[0].id}, '${formatDate(tomorrow)}', '11:00:00', '12:00:00', 80000, 'confirmed', 'paid', '${invoice1}'),
        (${userId}, ${courts[1].id}, '${formatDate(dayAfterTomorrow)}', '16:00:00', '17:00:00', 80000, 'pending', 'unpaid', '${invoice2}'),
        (${userId}, ${courts[1].id}, '${formatDate(dayAfterTomorrow)}', '17:00:00', '18:00:00', 80000, 'pending', 'unpaid', '${invoice2}')
      `);
      console.log('Sample data inserted into bookings successfully.');
    }
    
    console.log('Migration completed: create_booking_table');
  } catch (error) {
    console.error('Error in migration create_booking_table:', error);
    throw error;
  }
}

module.exports = createBookingTable;
