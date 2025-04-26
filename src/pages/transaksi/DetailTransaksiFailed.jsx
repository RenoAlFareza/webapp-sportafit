// src/pages/transaksi/DetailTransaksiFailed.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { getBookingById } from "../../services/bookingHistoryService";

// Fallback data jika tidak ada data transaksi
const fallbackTransaction = {
  id: "INV-000000-XXXXXX-00",
  arenaName: "Zuper Badminton Keputih",
  venueSubtitle: "Zuper Badminton Keputih, Surabaya",
  formattedDate: "Sabtu, 19 April 2025",
  time: "19:00 - 22:00",
  totalPrice: 240000,
  serviceFee: 5000,
  status: "Kadaluarsa",
  completedAt: new Date().toISOString()
};

export default function DetailTransaksiFailed() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);

  // Ambil data transaksi berdasarkan ID
  useEffect(() => {
    const transactionData = getBookingById(id);
    if (transactionData) {
      setTransaction(transactionData);
    } else {
      setTransaction(fallbackTransaction);
    }
  }, [id]);

  // Jika data belum diambil, tampilkan loading
  if (!transaction) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Hitung total harga
  const price = transaction.totalPrice || 0;
  const serviceFee = transaction.serviceFee || 5000;
  const total = price + serviceFee;

  // Format tanggal transaksi
  const formattedCompletedDate = transaction.completedAt
    ? new Date(transaction.completedAt).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : "-";

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 pt-6 pb-24 font-jakarta">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-600">
          <IoArrowBack size={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">
          Detail Transaksi
        </h1>
        <div className="w-6" />
      </div>

      {/* Status Transaksi */}
      <div className="bg-red-100 text-red-800 rounded-xl shadow px-4 py-4 mb-4 text-center">
        <div className="text-lg font-bold">Pembayaran Gagal</div>
        <div className="text-sm">Waktu pembayaran telah habis</div>
      </div>

      {/* ID Transaksi */}
      <div className="bg-white rounded-xl shadow px-4 py-3 mb-4">
        <div className="text-xs text-gray-600 mb-1">ID Transaksi:</div>
        <div className="text-sm font-semibold">{transaction.id}</div>
      </div>

      {/* Waktu Transaksi */}
      <div className="bg-white rounded-xl shadow px-4 py-3 mb-4">
        <div className="text-xs text-gray-600 mb-1">Waktu Kadaluarsa:</div>
        <div className="text-sm font-semibold">{formattedCompletedDate}</div>
      </div>

      {/* Ringkasan Booking */}
      <div className="bg-white rounded-xl shadow px-4 py-3 mb-4">
        <div className="text-sm font-semibold mb-2">Detail Pemesanan</div>
        <div className="space-y-1">
          <div className="text-sm font-semibold">{transaction.arenaName}</div>
          <div className="text-xs text-gray-600">
            {transaction.formattedDate || transaction.date} | {transaction.time}
          </div>
          <div className="text-xs text-gray-600">
            {transaction.courtName || "Lapangan 1"}
          </div>
        </div>
      </div>

      {/* Rincian Pembayaran */}
      <div className="bg-white rounded-xl shadow px-4 py-3 mb-4">
        <div className="text-sm font-semibold mb-2">Rincian Pembayaran</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Harga Lapangan</span>
            <span>Rp {price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Biaya Layanan</span>
            <span>Rp {serviceFee.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-200 my-1 pt-1"></div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Total Pembayaran</span>
            <span>Rp {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tombol Booking Ulang */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl py-4 px-4">
        <button
          onClick={() => navigate(`/arena/${transaction.arenaId}`)}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow active:bg-blue-700 transition"
        >
          Booking Ulang
        </button>
      </div>
    </div>
  );
}
