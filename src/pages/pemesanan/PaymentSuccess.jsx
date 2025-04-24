// src/pages/pemesanan/PaymentSuccess.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  // Fungsi untuk menangani klik tombol kembali ke beranda
  const handleBackToHome = () => {
    navigate("/");
  };

  // Fungsi untuk menangani klik tombol cetak bukti pembayaran
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-6 font-jakarta">
      <div className="w-full max-w-[434px] bg-white rounded-3xl shadow-md overflow-hidden flex flex-col items-center p-6">

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-sporta-blue flex items-center justify-center mb-4">
          <IoCheckmarkCircleOutline
            size={40}
            className="text-white"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Pembayaran Berhasil!
        </h2>
        <p className="text-center text-gray-600 mb-6 px-4">
          Terima kasih! Pembayaran Anda telah diterima.
          Transaksi Anda akan segera diproses.
        </p>

        {/* Ringkasan Pembayaran */}
        <div className="w-full bg-gray-100 rounded-xl p-4 mb-6">
          <div className="flex justify-between text-sm py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Nomor Transaksi</span>
            <span className="font-medium text-gray-900">#TRX12345678</span>
          </div>
          <div className="flex justify-between text-sm py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Jumlah Pembayaran</span>
            <span className="font-medium text-gray-900">Rp240.000</span>
          </div>
          <div className="flex justify-between text-sm py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Tanggal</span>
            <span className="font-medium text-gray-900">19 Apr 2025, 19:02</span>
          </div>
          <div className="flex justify-between text-sm py-2">
            <span className="font-medium text-gray-700">Metode Pembayaran</span>
            <span className="font-medium text-gray-900">DANA</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleBackToHome}
            className="w-full py-3 bg-sporta-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Lanjutkan
          </button>
          <button
            onClick={handleBackToHome}
            className="w-full py-3 border border-sporta-blue text-sporta-blue font-semibold rounded-lg hover:bg-sporta-blue hover:text-white transition"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={handlePrintReceipt}
            className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Cetak Bukti Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
