// server/index.js
require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const session    = require("express-session");
const passport   = require("./config/passport");
const runMigrations = require("./migrations");
const authRoutes = require("./routes/authRoutes");
const socialAuthRoutes = require("./routes/socialAuthRoutes");
const arenaRoutes = require("./routes/arenaRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const voucherRoutes = require("./routes/voucherRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true // Diperlukan untuk autentikasi
}));
app.use(express.json());  // parse JSON body

// Session middleware (diperlukan untuk Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || "your-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set true jika menggunakan HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Log environment variables for debugging (redact sensitive info)
console.log("Environment variables:");
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("PORT:", process.env.PORT);
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set");

// Health-check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Mount auth routes
// → POST /api/auth/register
// → POST /api/auth/login
app.use("/api/auth", authRoutes);

// Mount social auth routes
// → GET /api/auth/google
// → GET /api/auth/facebook
// → GET /api/auth/twitter
app.use("/api/auth", socialAuthRoutes);

// Mount arena routes
// → GET /api/arenas
// → GET /api/arenas/search
// → GET /api/arenas/:id
// → GET /api/arenas/:id/courts
app.use("/api/arenas", arenaRoutes);

// Mount booking routes
// → GET /api/bookings/available-slots
// → GET /api/bookings/courts
// → POST /api/bookings
// → GET /api/bookings/user/:userId
// → PUT /api/bookings/:invoiceNumber
// → GET /api/bookings/:invoiceNumber
app.use("/api/bookings", bookingRoutes);

// Mount voucher routes
// → GET /api/vouchers
// → GET /api/vouchers/:id
// → GET /api/vouchers/code/:code
// → GET /api/vouchers/user/my-vouchers
// → POST /api/vouchers/user/add
// → POST /api/vouchers/user/use
app.use("/api/vouchers", voucherRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Passport error handler
app.use((err, req, res, next) => {
  if (err && err.name === 'AuthenticationError') {
    console.error("Authentication Error:", err);
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=${encodeURIComponent(err.message)}`);
  }
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// Run migrations and start server
(async () => {
  try {
    // Run database migrations
    await runMigrations();

    // Start server
    app.listen(port, () =>
      console.log(`🚀 Server berjalan di http://localhost:${port}`)
    );
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
