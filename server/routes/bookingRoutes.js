// server/routes/bookingRoutes.js
const router = require('express').Router();
const bookingController = require('../controllers/bookingController');

// GET /api/bookings/available-slots - Get available slots for a court on a specific date
router.get('/available-slots', bookingController.getAvailableSlots);

// GET /api/bookings/courts - Get courts by arena ID with availability info
router.get('/courts', bookingController.getCourtsByArenaWithAvailability);

// POST /api/bookings - Create a new booking
router.post('/', bookingController.createBooking);

// GET /api/bookings/user/:userId - Get user's bookings
router.get('/user/:userId', bookingController.getUserBookings);

// PUT /api/bookings/:invoiceNumber - Update booking status
router.put('/:invoiceNumber', bookingController.updateBookingStatus);

// GET /api/bookings/:invoiceNumber - Get booking details by invoice number
router.get('/:invoiceNumber', bookingController.getBookingByInvoice);

module.exports = router;
