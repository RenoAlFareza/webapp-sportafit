// server/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Buat instance Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || "badminton_reservation",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: true, // Set true untuk debugging
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test koneksi
sequelize.authenticate()
  .then(() => console.log("Database connection established successfully."))
  .catch(err => console.error("Unable to connect to the database:", err));

module.exports = sequelize;
