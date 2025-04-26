// src/pages/pemesanan/ListPemesanan.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import BottomNavbar from "../main_menu/BottomNavbar";
import { getBookingHistory, removeExpiredBookings, getRemainingTime, formatTime } from "../../services/bookingHistoryService";

// Tidak ada lagi fallback data, hanya menampilkan pemesanan user

export default function ListPemesanan() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remainingTimes, setRemainingTimes] = useState({});

  // Ambil data booking dari localStorage
  useEffect(() => {
    // Hapus booking yang sudah kadaluarsa
    const validBookings = removeExpiredBookings();

    // Tampilkan booking dari localStorage
    setBookings(validBookings);
    setLoading(false);
  }, []);

  // Hitung sisa waktu untuk setiap booking
  useEffect(() => {
    // Inisialisasi sisa waktu
    const times = {};
    bookings.forEach(booking => {
      if (booking.status === "Menunggu" && booking.expiryTime) {
        times[booking.id] = getRemainingTime(booking.expiryTime);
      }
    });
    setRemainingTimes(times);

    // Update sisa waktu setiap detik
    const timer = setInterval(() => {
      setRemainingTimes(prevTimes => {
        const newTimes = { ...prevTimes };

        // Update sisa waktu untuk setiap booking
        Object.keys(newTimes).forEach(id => {
          if (newTimes[id] > 0) {
            newTimes[id] -= 1;
          }

          // Jika waktu habis, hapus booking dari daftar
          if (newTimes[id] <= 0) {
            // Hapus booking yang sudah kadaluarsa
            removeExpiredBookings();

            // Update daftar booking
            setBookings(prev => prev.filter(b => b.id !== id));
          }
        });

        return newTimes;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [bookings]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 font-jakarta">
      {/* Header fixed */}
      <div className="fixed top-0 left-0 right-0 bg-[#F9FAFB] z-20">
        <div className="max-w-[434px] mx-auto px-4 pt-6 pb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600"
            >
              <IoArrowBack size={24} />
            </button>
            <h1 className="flex-1 text-center text-xl font-bold">
              Riwayat Pemesanan
            </h1>
            <div className="w-6" />
          </div>
        </div>
        <div className="border-b border-gray-200" />
      </div>

      {/* Konten */}
      <div className="pt-24 max-w-[434px] mx-auto px-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Tidak ada pemesanan yang menunggu pembayaran</p>
          </div>
        ) : (
          bookings.map((bk) => (
            <div
              key={bk.id}
              onClick={() => navigate(`/payment-detail/${bk.id}`)}
              className="bg-white rounded-2xl shadow px-4 py-4 flex justify-between items-start"
            >
              {/* Detail */}
              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  <span className="font-semibold">ID Transaksi:</span> {bk.id}
                </div>
                <div className="text-sm font-semibold uppercase">
                  {bk.activity} – {bk.venueTitle}
                </div>
                <div className="text-xs text-gray-600">{bk.activity}</div>
                <div className="text-xs text-gray-600">{bk.venueSubtitle}</div>
                <div className="text-xs text-gray-600">{bk.formattedDate || bk.date}</div>
                <div className="text-xs text-gray-600">{bk.time}</div>

                {/* Timer */}
                {bk.status === "Menunggu" && remainingTimes[bk.id] > 0 && (
                  <div className="text-xs text-red-600 font-semibold mt-1">
                    Bayar dalam: {formatTime(remainingTimes[bk.id])}
                  </div>
                )}
              </div>

              {/* Status */}
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  bk.status === "Menunggu"
                    ? "bg-yellow-100 text-yellow-800"
                    : bk.status === "Kadaluarsa"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {bk.status}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}
