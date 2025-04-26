// server/routes/authRoutes.js
const router = require("express").Router();
const authController = require("../controllers/authController");

// Endpoint register
router.post("/register", authController.register);

// Endpoint login
router.post("/login", authController.login);

// Endpoint untuk request reset password
router.post("/forgot-password", authController.forgotPassword);

// Endpoint untuk verifikasi kode
router.post("/verify-code", authController.verifyCode);

// Endpoint untuk reset password (dengan atau tanpa token di header)
router.post("/reset-password", authController.resetPassword);

// Endpoint alternatif untuk reset password dengan token di URL
router.post("/reset-password/:token", (req, res, next) => {
  // Tambahkan token dari URL ke header Authorization
  if (req.params.token) {
    req.headers.authorization = `Bearer ${req.params.token}`;
  }
  next();
}, authController.resetPassword);

// Endpoint untuk mendapatkan data user berdasarkan token
router.get("/me", (req, res) => {
  // Ambil token dari header Authorization
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    // Verifikasi token
    const jwt = require("jsonwebtoken");
    const User = require("../models/userModel");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // Cari user berdasarkan id dari token
    User.findOne({ where: { id: decoded.userId } })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }

        // Hapus password dari respons
        const userData = user.toJSON();
        delete userData.password;

        res.json({ user: userData });
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  } catch (err) {
    res.status(401).json({ message: "Token tidak valid" });
  }
});

module.exports = router;