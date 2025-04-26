// server/migrations/create_arena_tables.js
const db = require('../db');

async function createArenaTables() {
  try {
    // Koneksi ke database
    await db.authenticate();
    console.log('Database connection established successfully.');

    // Cek apakah tabel arenas sudah ada
    try {
      await db.query('SELECT 1 FROM arenas LIMIT 1');
      console.log('Table arenas already exists.');
    } catch (error) {
      // Jika error, berarti tabel belum ada
      console.log('Creating arenas table...');
      await db.query(`
        CREATE TABLE arenas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          address VARCHAR(255) NOT NULL,
          city VARCHAR(100) NOT NULL,
          description TEXT,
          image_url VARCHAR(255),
          opening_hours VARCHAR(100),
          rating FLOAT DEFAULT 0,
          reviews_count INT DEFAULT 0,
          price_per_hour INT,
          facilities TEXT,
          policies TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Table arenas created successfully.');

      // Insert sample data
      console.log('Inserting sample data into arenas...');
      await db.query(`
        INSERT INTO arenas (name, address, city, description, image_url, opening_hours, rating, reviews_count, price_per_hour, facilities, policies)
        VALUES
        ('Arena Victory Badminton', 'Jl. Merdeka No.10', 'Surabaya', 'Lapangan badminton indoor berstandar nasional. Lantai kayu, pencahayaan optimal, dan ruang ganti yang bersih.', '/foto_lapangan.png', '08.00 - 22.00 WIB', 4.5, 123, 80000, '["Shower", "Toilet", "Kantin", "Parkir"]', '["Dimohon Tidak Membawa Makanan dan Minuman dari luar Arena", "Dilarang Merokok / Vape di Area Badminton", "Wajib Memakai Sepatu Olahraga Badminton & Baju Olahraga", "Dilarang Meludah Atau Membuang Ingus di Area Badminton", "Jaga Barang Anda, Kehilangan Bukan Tanggung Jawab Kami"]'),
        ('Lapangan Bintang Sport', 'Jl. Pahlawan No.22', 'Surabaya', 'Lapangan badminton dengan fasilitas lengkap dan nyaman. Cocok untuk pemain dari semua level.', '/foto_lapangan1.jpg', '09.00 - 23.00 WIB', 4.2, 87, 75000, '["Shower", "Toilet", "Parkir", "WiFi"]', '["Dimohon Tidak Membawa Makanan dan Minuman dari luar Arena", "Dilarang Merokok / Vape di Area Badminton", "Wajib Memakai Sepatu Olahraga Badminton & Baju Olahraga"]'),
        ('ZUPER KEPUTIH', 'Jl. Keputih No.15', 'Surabaya', 'Lapangan badminton premium dengan fasilitas modern dan pelayanan terbaik.', '/foto_lapangan2.jpg', '08.00 - 24.00 WIB', 4.7, 156, 90000, '["Shower", "Toilet", "Kantin", "Parkir", "WiFi", "Loker"]', '["Dimohon Tidak Membawa Makanan dan Minuman dari luar Arena", "Dilarang Merokok / Vape di Area Badminton", "Wajib Memakai Sepatu Olahraga Badminton & Baju Olahraga"]'),
        ('ZUPER DHARMAHUSADA', 'Jl. Dharmahusada No.30', 'Surabaya', 'Lapangan badminton modern dengan fasilitas lengkap dan lokasi strategis.', '/foto_lapangan3.jpg', '08.00 - 23.00 WIB', 4.6, 112, 85000, '["Shower", "Toilet", "Kantin", "Parkir", "WiFi"]', '["Dimohon Tidak Membawa Makanan dan Minuman dari luar Arena", "Dilarang Merokok / Vape di Area Badminton", "Wajib Memakai Sepatu Olahraga Badminton & Baju Olahraga"]')
      `);
      console.log('Sample data inserted into arenas successfully.');
    }

    // Cek apakah tabel courts sudah ada
    try {
      await db.query('SELECT 1 FROM courts LIMIT 1');
      console.log('Table courts already exists.');
    } catch (error) {
      // Jika error, berarti tabel belum ada
      console.log('Creating courts table...');
      await db.query(`
        CREATE TABLE courts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          arena_id INT NOT NULL,
          name VARCHAR(100) NOT NULL,
          type VARCHAR(50),
          price_per_hour INT NOT NULL,
          status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (arena_id) REFERENCES arenas(id) ON DELETE CASCADE
        )
      `);
      console.log('Table courts created successfully.');

      // Insert sample data
      console.log('Inserting sample data into courts...');
      await db.query(`
        INSERT INTO courts (arena_id, name, type, price_per_hour, status)
        VALUES
        (1, 'Lapangan 1', 'badminton', 80000, 'active'),
        (1, 'Lapangan 2', 'badminton', 80000, 'active'),
        (1, 'Lapangan 3', 'badminton', 85000, 'active'),
        (2, 'Lapangan 1', 'badminton', 75000, 'active'),
        (2, 'Lapangan 2', 'badminton', 75000, 'active'),
        (3, 'Lapangan 1', 'badminton', 90000, 'active'),
        (3, 'Lapangan 2', 'badminton', 90000, 'active'),
        (3, 'Lapangan 3', 'badminton', 95000, 'active'),
        (4, 'Lapangan 1', 'badminton', 85000, 'active'),
        (4, 'Lapangan 2', 'badminton', 85000, 'active')
      `);
      console.log('Sample data inserted into courts successfully.');
    }

    console.log('Arena tables migration completed successfully.');
  } catch (error) {
    console.error('Error during arena tables migration:', error);
    throw error;
  }
}

// Export fungsi migrasi
module.exports = createArenaTables;
