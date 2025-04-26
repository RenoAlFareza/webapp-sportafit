// src/pages/debug/DebugTransactions.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import {
  getTransactions,
  getBookingHistory,
  clearAllTransactions,
  clearAllBookingHistory,
  addTransactions,
  moveBookingToTransaction
} from "../../services/bookingHistoryService";

export default function DebugTransactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load data
  const loadData = () => {
    try {
      setLoading(true);
      const allTransactions = getTransactions();
      const allBookings = getBookingHistory();

      setTransactions(allTransactions);
      setBookings(allBookings);

      setMessage(`Loaded ${allTransactions.length} transactions and ${allBookings.length} bookings`);
    } catch (error) {
      setMessage(`Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Clear all transactions
  const handleClearTransactions = () => {
    try {
      clearAllTransactions();
      setMessage("All transactions cleared");
      loadData();
    } catch (error) {
      setMessage(`Error clearing transactions: ${error.message}`);
    }
  };

  // Clear all booking history
  const handleClearBookings = () => {
    try {
      clearAllBookingHistory();
      setMessage("All booking history cleared");
      loadData();
    } catch (error) {
      setMessage(`Error clearing booking history: ${error.message}`);
    }
  };

  // Add mock transaction (1 hour)
  const handleAddMockTransaction = () => {
    try {
      const mockTransaction = {
        id: `MOCK-${Date.now()}`,
        arenaName: "Debug Arena",
        venueSubtitle: "Debug Arena, Debug City",
        formattedDate: "Senin, 01 Januari 2025",
        date: "2025-01-01",
        time: "10:00 - 11:00",
        timeSlots: ["10:00", "11:00"],
        courtName: "Lapangan 1",
        activity: "Badminton",
        totalPrice: 100000,
        pricePerHour: 100000,
        serviceFee: 5000,
        total: 105000,
        paymentMethod: "DANA",
        status: "Berhasil",
        isPaid: true,
        completedAt: new Date().toISOString(),
        // Tambahkan properti user untuk detail transaksi
        user: {
          name: "User Debug",
          email: "user@debug.com",
          phone: "081234567890"
        },
        // Tambahkan properti payment untuk detail transaksi
        payment: {
          method: "DANA",
          status: "LUNAS",
          price: 100000,
          promo: 0,
          fee: 5000,
          total: 105000
        }
      };

      addTransactions([mockTransaction]);
      setMessage("Mock transaction (1 hour) added");
      loadData();
    } catch (error) {
      setMessage(`Error adding mock transaction: ${error.message}`);
    }
  };

  // Add mock transaction with multiple time slots (2 hours)
  const handleAddMockMultipleHoursTransaction = () => {
    try {
      const mockTransaction = {
        id: `MOCK-MULTI-${Date.now()}`,
        arenaName: "Debug Arena",
        venueSubtitle: "Debug Arena, Debug City",
        formattedDate: "Senin, 01 Januari 2025",
        date: "2025-01-01",
        time: "14:00 - 16:00",
        timeSlots: ["14:00", "15:00", "16:00"], // 2 jam (3 time slots)
        courtName: "Lapangan 2",
        activity: "Badminton",
        pricePerHour: 87500, // Harga per jam
        totalPrice: 175000, // Total untuk 2 jam
        serviceFee: 5000,
        total: 180000, // Total + biaya layanan
        paymentMethod: "DANA",
        status: "Berhasil",
        isPaid: true,
        completedAt: new Date().toISOString(),
        // Tambahkan properti user untuk detail transaksi
        user: {
          name: "User Debug",
          email: "user@debug.com",
          phone: "081234567890"
        },
        // Tambahkan properti payment untuk detail transaksi
        payment: {
          method: "DANA",
          status: "LUNAS",
          price: 175000,
          promo: 0,
          fee: 5000,
          total: 180000
        }
      };

      addTransactions([mockTransaction]);
      setMessage("Mock transaction (2 hours) added");
      loadData();
    } catch (error) {
      setMessage(`Error adding mock multiple hours transaction: ${error.message}`);
    }
  };

  // Add mock transaction with 3 hours
  const handleAddMockThreeHoursTransaction = () => {
    try {
      // Harga per jam
      const pricePerHour = 80000;
      // Total jam
      const totalHours = 3;
      // Total harga
      const totalPrice = pricePerHour * totalHours;
      // Biaya layanan
      const serviceFee = 5000;
      // Total pembayaran
      const totalPayment = totalPrice + serviceFee;

      // Buat array timeSlots yang realistis (jam yang dipilih, bukan range)
      const timeSlots = ["11:00", "12:00", "13:00"];

      const mockTransaction = {
        id: `MOCK-3HOURS-${Date.now()}`,
        arenaName: "Arena Victory Badminton",
        venueSubtitle: "Arena Victory Badminton, Surabaya",
        formattedDate: "Saturday, 26 April 2025",
        date: "2025-04-26",
        time: "11:00 - 14:00", // Range waktu (start - end)
        timeSlots: timeSlots, // Jam yang dipilih (bukan range)
        courtName: "Lapangan 1",
        activity: "Badminton",
        pricePerHour: pricePerHour, // Harga per jam
        totalPrice: totalPrice, // Total untuk 3 jam
        serviceFee: serviceFee,
        total: totalPayment, // Total + biaya layanan
        paymentMethod: "DANA",
        status: "Berhasil",
        isPaid: true,
        completedAt: new Date().toISOString(),
        // Tambahkan properti user untuk detail transaksi
        user: {
          name: "Pengguna",
          email: "user@example.com",
          phone: "081234567890"
        },
        // Tambahkan properti payment untuk detail transaksi
        payment: {
          method: "DANA",
          status: "LUNAS",
          price: totalPrice,
          promo: 0,
          fee: serviceFee,
          total: totalPayment
        }
      };

      console.log('Adding mock 3 hours transaction:', {
        pricePerHour,
        totalHours,
        totalPrice,
        serviceFee,
        totalPayment,
        timeSlots: mockTransaction.timeSlots,
        time: mockTransaction.time
      });

      addTransactions([mockTransaction]);
      setMessage(`Mock transaction (3 hours) added: ${pricePerHour} × ${totalHours} = ${totalPrice} + ${serviceFee} = ${totalPayment}`);
      loadData();
    } catch (error) {
      setMessage(`Error adding 3 hours transaction: ${error.message}`);
    }
  };

  // Add mock failed transaction
  const handleAddMockFailedTransaction = () => {
    try {
      const mockFailedTransaction = {
        id: `MOCK-FAILED-${Date.now()}`,
        arenaName: "Debug Arena",
        venueSubtitle: "Debug Arena, Debug City",
        formattedDate: "Selasa, 02 Januari 2025",
        date: "2025-01-02",
        time: "14:00 - 15:00",
        timeSlots: ["14:00", "15:00"],
        courtName: "Lapangan 2",
        activity: "Basket",
        totalPrice: 150000,
        serviceFee: 5000,
        total: 155000,
        paymentMethod: "GoPay",
        status: "Gagal",
        isPaid: false,
        completedAt: new Date().toISOString(),
        // Tambahkan properti user untuk detail transaksi
        user: {
          name: "User Debug",
          email: "user@debug.com",
          phone: "081234567890"
        },
        // Tambahkan properti payment untuk detail transaksi
        payment: {
          method: "GoPay",
          status: "Gagal",
          price: 150000,
          promo: 0,
          fee: 5000,
          total: 155000
        }
      };

      addTransactions([mockFailedTransaction]);
      setMessage("Mock failed transaction added");
      loadData();
    } catch (error) {
      setMessage(`Error adding mock failed transaction: ${error.message}`);
    }
  };

  // Add mock booking to history
  const handleAddMockBooking = () => {
    try {
      const mockBooking = {
        id: `MOCK-BOOKING-${Date.now()}`,
        arenaName: "Debug Arena",
        venueSubtitle: "Debug Arena, Debug City",
        formattedDate: "Rabu, 03 Januari 2025",
        date: "2025-01-03",
        time: "16:00 - 17:00",
        timeSlots: ["16:00", "17:00"],
        courtName: "Lapangan 3",
        activity: "Badminton",
        totalPrice: 90000,
        pricePerHour: 90000,
        serviceFee: 5000,
        total: 95000,
        status: "Menunggu",
        isPaid: false,
        createdAt: new Date().toISOString(),
        expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 menit dari sekarang
        user: {
          name: "User Debug",
          email: "user@debug.com",
          phone: "081234567890"
        }
      };

      // Simpan ke booking history
      const bookings = getBookingHistory();
      localStorage.setItem('bookingHistory', JSON.stringify([mockBooking, ...bookings]));

      setMessage("Mock booking added to history");
      loadData();
    } catch (error) {
      setMessage(`Error adding mock booking: ${error.message}`);
    }
  };

  // Test move booking to transaction
  const handleTestMoveBookingToTransaction = () => {
    try {
      // Ambil booking pertama dari history
      const bookings = getBookingHistory();

      if (bookings.length === 0) {
        setMessage("No bookings found in history. Add a mock booking first.");
        return;
      }

      const booking = bookings[0];
      console.log('Testing move booking to transaction:', booking);

      // Tambahkan data tambahan
      const additionalData = {
        protection: false,
        protectionFee: 0,
        paymentDate: new Date().toISOString(),
        user: {
          name: "Test User",
          email: "test@example.com",
          phone: "08123456789"
        }
      };

      // Pindahkan booking ke transaksi
      const result = moveBookingToTransaction(booking.id, "Berhasil", additionalData);

      if (result) {
        setMessage(`Successfully moved booking ${booking.id} to transaction`);
      } else {
        setMessage(`Failed to move booking ${booking.id} to transaction`);
      }

      loadData();
    } catch (error) {
      setMessage(`Error testing move booking to transaction: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 font-jakarta">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#F9FAFB] z-20">
        <div className="max-w-[434px] mx-auto px-4 pt-6 pb-4">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-2 text-gray-600">
              <IoArrowBack size={24} />
            </button>
            <h1 className="flex-1 text-center text-xl font-bold">Debug Transactions</h1>
            <div className="w-6" />
          </div>
        </div>
        <div className="border-b border-gray-200" />
      </div>

      {/* Content */}
      <div className="pt-24 max-w-[434px] mx-auto px-4 space-y-4">
        {/* Message */}
        {message && (
          <div className="bg-blue-100 text-blue-800 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={loadData}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Refresh Data
          </button>
          <button
            onClick={handleAddMockTransaction}
            className="bg-green-500 text-white py-2 px-4 rounded-lg"
          >
            Add Mock Success Transaction (1 Hour)
          </button>
          <button
            onClick={handleAddMockMultipleHoursTransaction}
            className="bg-green-300 text-white py-2 px-4 rounded-lg"
          >
            Add Mock Success Transaction (2 Hours)
          </button>
          <button
            onClick={handleAddMockThreeHoursTransaction}
            className="bg-green-200 text-white py-2 px-4 rounded-lg"
          >
            Add Mock Success Transaction (3 Hours)
          </button>
          <button
            onClick={handleAddMockFailedTransaction}
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg"
          >
            Add Mock Failed Transaction
          </button>
          <button
            onClick={handleClearTransactions}
            className="bg-red-500 text-white py-2 px-4 rounded-lg"
          >
            Clear All Transactions
          </button>
          <button
            onClick={handleClearBookings}
            className="bg-orange-500 text-white py-2 px-4 rounded-lg"
          >
            Clear All Bookings
          </button>
          <button
            onClick={handleAddMockBooking}
            className="bg-purple-500 text-white py-2 px-4 rounded-lg"
          >
            Add Mock Booking to History
          </button>
          <button
            onClick={handleTestMoveBookingToTransaction}
            className="bg-indigo-500 text-white py-2 px-4 rounded-lg"
          >
            Test Move Booking to Transaction
          </button>
        </div>

        {/* Transactions */}
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Transactions ({transactions.length})</h2>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-gray-100 p-4 rounded-lg text-gray-500 text-center">
              No transactions found
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-white p-3 rounded-lg shadow">
                  <div className="text-xs text-gray-500">ID: {tx.id}</div>
                  <div className="font-semibold">{tx.arenaName || tx.venueTitle}</div>
                  <div className="text-sm">{tx.formattedDate} | {tx.time}</div>
                  <div className="text-sm">Status: <span className={tx.status === "Berhasil" ? "text-green-600" : "text-red-600"}>{tx.status}</span></div>
                  <div className="text-sm">Total: Rp{tx.totalPrice?.toLocaleString() || "0"}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings */}
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Bookings ({bookings.length})</h2>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-gray-100 p-4 rounded-lg text-gray-500 text-center">
              No bookings found
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white p-3 rounded-lg shadow">
                  <div className="text-xs text-gray-500">ID: {booking.id}</div>
                  <div className="font-semibold">{booking.arenaName || booking.venueTitle}</div>
                  <div className="text-sm">{booking.formattedDate} | {booking.time}</div>
                  <div className="text-sm">Status: <span className={booking.status === "Berhasil" ? "text-green-600" : "text-red-600"}>{booking.status}</span></div>
                  <div className="text-sm">Total: Rp{booking.totalPrice?.toLocaleString() || "0"}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
