// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware untuk memeriksa apakah user sudah login
const authMiddleware = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Tidak ada token autentikasi'
      });
    }
    
    // Ambil token dari header
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Tidak ada token autentikasi'
      });
    }
    
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Cari user berdasarkan ID dari token
    const user = await User.findOne({ where: { id: decoded.userId } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }
    
    // Tambahkan user ke request
    req.user = user;
    
    // Lanjutkan ke handler berikutnya
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token sudah kadaluarsa'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
