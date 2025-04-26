// server/controllers/bookingController.js
const Booking = require('../models/bookingModel');
const Court = require('../models/courtModel');
const Arena = require('../models/arenaModel');
const User = require('../models/userModel');
const { Op } = require('sequelize');
const { format, parse, addHours } = require('date-fns');

// Fungsi untuk menghasilkan nomor invoice
const generateInvoiceNumber = (userId, courtId) => {
  const date = format(new Date(), 'yyMMdd');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const suffix = Math.floor(Math.random() * 90 + 10);
  return `INV-${date}-${random}-${suffix}`;
};

// Get available slots for a court on a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { courtId, date } = req.query;
    
    if (!courtId || !date) {
      return res.status(400).json({ message: 'Court ID and date are required' });
    }
    
    // Validate court exists
    const court = await Court.findByPk(courtId);
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    
    // Get all bookings for this court on this date
    const bookings = await Booking.findAll({
      where: {
        court_id: courtId,
        booking_date: date,
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });
    
    // Create array of all possible time slots (1-hour intervals)
    const allTimeSlots = [];
    for (let hour = 1; hour <= 24; hour++) {
      const timeStr = `${String(hour).padStart(2, '0')}:00`;
      allTimeSlots.push(timeStr);
    }
    
    // Mark booked slots
    const bookedSlots = bookings.map(booking => {
      const startTime = format(new Date(booking.start_time), 'HH:mm');
      return startTime;
    });
    
    // Mark unavailable slots (early morning hours)
    const unavailableSlots = ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00'];
    
    // Return all slots with availability status
    const slots = allTimeSlots.map(time => {
      return {
        time,
        status: bookedSlots.includes(time) ? 'booked' : 
                unavailableSlots.includes(time) ? 'unavailable' : 'available',
        price: court.price_per_hour
      };
    });
    
    res.json(slots);
  } catch (error) {
    console.error('Error getting available slots:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get courts by arena ID with availability info
exports.getCourtsByArenaWithAvailability = async (req, res) => {
  try {
    const { arenaId, date } = req.query;
    
    if (!arenaId) {
      return res.status(400).json({ message: 'Arena ID is required' });
    }
    
    // Get all courts for this arena
    const courts = await Court.findAll({
      where: { 
        arena_id: arenaId,
        status: 'active'
      },
      order: [['name', 'ASC']]
    });
    
    if (courts.length === 0) {
      return res.status(404).json({ message: 'No courts found for this arena' });
    }
    
    // If date is provided, get availability info
    if (date) {
      // Get all bookings for these courts on this date
      const courtIds = courts.map(court => court.id);
      const bookings = await Booking.findAll({
        where: {
          court_id: {
            [Op.in]: courtIds
          },
          booking_date: date,
          status: {
            [Op.notIn]: ['cancelled']
          }
        }
      });
      
      // Add availability info to each court
      const courtsWithAvailability = courts.map(court => {
        const courtBookings = bookings.filter(booking => booking.court_id === court.id);
        const bookedHours = courtBookings.length;
        const totalHours = 24 - 7; // Excluding unavailable hours (1-7 AM)
        const availabilityPercentage = Math.round(((totalHours - bookedHours) / totalHours) * 100);
        
        return {
          ...court.toJSON(),
          availability: {
            percentage: availabilityPercentage,
            bookedHours,
            totalAvailableHours: totalHours
          }
        };
      });
      
      return res.json(courtsWithAvailability);
    }
    
    // If no date provided, just return the courts
    res.json(courts);
  } catch (error) {
    console.error('Error getting courts with availability:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, courtId, date, timeSlots } = req.body;
    
    if (!userId || !courtId || !date || !timeSlots || timeSlots.length === 0) {
      return res.status(400).json({ 
        message: 'User ID, court ID, date, and at least one time slot are required' 
      });
    }
    
    // Validate user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Validate court exists
    const court = await Court.findByPk(courtId, {
      include: [{ model: Arena }]
    });
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }
    
    // Check if any of the requested time slots are already booked
    const bookingDate = date;
    const existingBookings = await Booking.findAll({
      where: {
        court_id: courtId,
        booking_date: bookingDate,
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });
    
    const bookedSlots = existingBookings.map(booking => 
      format(new Date(booking.start_time), 'HH:mm')
    );
    
    const requestedSlots = timeSlots.map(slot => slot);
    const conflictingSlots = requestedSlots.filter(slot => bookedSlots.includes(slot));
    
    if (conflictingSlots.length > 0) {
      return res.status(409).json({ 
        message: 'Some requested time slots are already booked',
        conflictingSlots 
      });
    }
    
    // Calculate total price
    const totalPrice = timeSlots.length * court.price_per_hour;
    
    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber(userId, courtId);
    
    // Create bookings for each time slot
    const bookingPromises = timeSlots.map(async (timeSlot) => {
      const startTime = timeSlot;
      const endTime = format(
        addHours(parse(timeSlot, 'HH:mm', new Date()), 1),
        'HH:mm'
      );
      
      return Booking.create({
        user_id: userId,
        court_id: courtId,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        total_price: court.price_per_hour,
        status: 'pending',
        payment_status: 'unpaid',
        invoice_number: invoiceNumber
      });
    });
    
    const createdBookings = await Promise.all(bookingPromises);
    
    // Return booking details with arena and court info
    res.status(201).json({
      message: 'Booking created successfully',
      bookings: createdBookings,
      invoiceNumber,
      totalPrice,
      arena: court.arena,
      court: {
        id: court.id,
        name: court.name,
        price_per_hour: court.price_per_hour
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Validate user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get all bookings for this user
    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [
        { 
          model: Court,
          include: [{ model: Arena }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    // Group bookings by invoice number
    const bookingsByInvoice = bookings.reduce((acc, booking) => {
      const invoiceNumber = booking.invoice_number;
      if (!acc[invoiceNumber]) {
        acc[invoiceNumber] = [];
      }
      acc[invoiceNumber].push(booking);
      return acc;
    }, {});
    
    // Format the response
    const formattedBookings = Object.keys(bookingsByInvoice).map(invoiceNumber => {
      const bookingsGroup = bookingsByInvoice[invoiceNumber];
      const firstBooking = bookingsGroup[0];
      
      // Calculate total price for this invoice
      const totalPrice = bookingsGroup.reduce((sum, b) => sum + b.total_price, 0);
      
      // Get the earliest and latest time slots
      const timeSlots = bookingsGroup.map(b => ({
        start: format(new Date(b.start_time), 'HH:mm'),
        end: format(new Date(b.end_time), 'HH:mm')
      }));
      
      timeSlots.sort((a, b) => a.start.localeCompare(b.start));
      const timeRange = `${timeSlots[0].start} - ${timeSlots[timeSlots.length - 1].end}`;
      
      return {
        invoiceNumber,
        date: format(new Date(firstBooking.booking_date), 'yyyy-MM-dd'),
        formattedDate: format(new Date(firstBooking.booking_date), 'EEEE, dd MMMM yyyy'),
        timeRange,
        arena: {
          id: firstBooking.court.arena.id,
          name: firstBooking.court.arena.name,
          address: firstBooking.court.arena.address,
          city: firstBooking.court.arena.city
        },
        court: {
          id: firstBooking.court.id,
          name: firstBooking.court.name
        },
        totalPrice,
        status: firstBooking.status,
        paymentStatus: firstBooking.payment_status,
        bookingDetails: bookingsGroup
      };
    });
    
    res.json(formattedBookings);
  } catch (error) {
    console.error('Error getting user bookings:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const { status, paymentStatus } = req.body;
    
    if (!invoiceNumber) {
      return res.status(400).json({ message: 'Invoice number is required' });
    }
    
    // Find all bookings with this invoice number
    const bookings = await Booking.findAll({
      where: { invoice_number: invoiceNumber }
    });
    
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found with this invoice number' });
    }
    
    // Update status for all bookings with this invoice number
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.payment_status = paymentStatus;
    
    await Booking.update(updateData, {
      where: { invoice_number: invoiceNumber }
    });
    
    res.json({ 
      message: 'Booking status updated successfully',
      invoiceNumber,
      updatedFields: updateData
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get booking details by invoice number
exports.getBookingByInvoice = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    
    if (!invoiceNumber) {
      return res.status(400).json({ message: 'Invoice number is required' });
    }
    
    // Find all bookings with this invoice number
    const bookings = await Booking.findAll({
      where: { invoice_number: invoiceNumber },
      include: [
        { model: User },
        { 
          model: Court,
          include: [{ model: Arena }]
        }
      ]
    });
    
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found with this invoice number' });
    }
    
    // Format the response
    const firstBooking = bookings[0];
    
    // Calculate total price
    const totalPrice = bookings.reduce((sum, booking) => sum + booking.total_price, 0);
    
    // Get time slots
    const timeSlots = bookings.map(booking => ({
      start: format(new Date(booking.start_time), 'HH:mm'),
      end: format(new Date(booking.end_time), 'HH:mm')
    }));
    
    timeSlots.sort((a, b) => a.start.localeCompare(b.start));
    
    const bookingDetails = {
      invoiceNumber,
      user: {
        id: firstBooking.user.id,
        name: firstBooking.user.name,
        email: firstBooking.user.email,
        phone: firstBooking.user.phone
      },
      arena: {
        id: firstBooking.court.arena.id,
        name: firstBooking.court.arena.name,
        address: firstBooking.court.arena.address,
        city: firstBooking.court.arena.city
      },
      court: {
        id: firstBooking.court.id,
        name: firstBooking.court.name,
        pricePerHour: firstBooking.court.price_per_hour
      },
      date: format(new Date(firstBooking.booking_date), 'yyyy-MM-dd'),
      formattedDate: format(new Date(firstBooking.booking_date), 'EEEE, dd MMMM yyyy'),
      timeSlots,
      totalPrice,
      status: firstBooking.status,
      paymentStatus: firstBooking.payment_status,
      createdAt: firstBooking.created_at
    };
    
    res.json(bookingDetails);
  } catch (error) {
    console.error('Error getting booking details:', error);
    res.status(500).json({ message: error.message });
  }
};
