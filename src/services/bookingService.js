// src/services/bookingService.js

// Base API URL
const API_BASE_URL = '/api';

// Booking Services
export const BookingService = {
  // Get available slots for a court on a specific date
  getAvailableSlots: async (courtId, date) => {
    try {
      const url = `${API_BASE_URL}/bookings/available-slots?courtId=${courtId}&date=${date}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },
  
  // Get courts by arena ID with availability info
  getCourtsByArenaWithAvailability: async (arenaId, date) => {
    try {
      let url = `${API_BASE_URL}/bookings/courts?arenaId=${arenaId}`;
      if (date) {
        url += `&date=${date}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching courts with availability:', error);
      throw error;
    }
  },
  
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const url = `${API_BASE_URL}/bookings`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  
  // Get user's bookings
  getUserBookings: async (userId) => {
    try {
      const url = `${API_BASE_URL}/bookings/user/${userId}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },
  
  // Update booking status
  updateBookingStatus: async (invoiceNumber, statusData) => {
    try {
      const url = `${API_BASE_URL}/bookings/${invoiceNumber}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },
  
  // Get booking details by invoice number
  getBookingByInvoice: async (invoiceNumber) => {
    try {
      const url = `${API_BASE_URL}/bookings/${invoiceNumber}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }
};

export default BookingService;
