// server/models/bookingModel.js
const { DataTypes } = require("sequelize");
const db = require("../db");
const User = require("./userModel");
const Court = require("./courtModel");

// Definisikan model Booking
const Booking = db.define("bookings", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  court_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Court,
      key: 'id'
    }
  },
  booking_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
    defaultValue: "pending",
  },
  payment_status: {
    type: DataTypes.ENUM("unpaid", "paid", "refunded"),
    defaultValue: "unpaid",
  },
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'bookings'
});

// Definisikan relasi
Booking.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Booking, { foreignKey: 'user_id' });

Booking.belongsTo(Court, { foreignKey: 'court_id' });
Court.hasMany(Booking, { foreignKey: 'court_id' });

module.exports = Booking;
