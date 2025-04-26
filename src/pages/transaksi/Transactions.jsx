// src/pages/transaksi/Transactions.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import BottomNavbar from "../main_menu/BottomNavbar";
import { getTransactions } from "../../services/bookingHistoryService";

// Tidak ada lagi fallback data, hanya menampilkan transaksi user

export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data transaksi dari localStorage
  useEffect(() => {
    try {
      // Ambil semua transaksi
      const allTransactions = getTransactions();
      console.log('Transactions in Transactions.jsx:', allTransactions);

      // Tampilkan transaksi dari localStorage
      setTransactions(allTransactions || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      // Jika terjadi error, tampilkan array kosong
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 font-jakarta">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#F9FAFB] z-20">
        <div className="max-w-[434px] mx-auto px-4 pt-6 pb-4">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-2 text-gray-600">
              <IoArrowBack size={24} />
            </button>
            <h1 className="flex-1 text-center text-xl font-bold">Transaksi</h1>
            <div className="w-6" />
          </div>
        </div>
        <div className="border-b border-gray-200" />
      </div>

      {/* Scrollable Content */}
      <div className="pt-24 max-w-[434px] mx-auto px-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Tidak ada riwayat transaksi</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const success = tx.status === "Berhasil";
            return (
              <div
                key={tx.id}
                onClick={() => navigate(success ? `/transaksi/success/${tx.id}` : `/transaksi/failed/${tx.id}`)}
                className={`
                  flex bg-white rounded-2xl shadow
                  border-l-4
                  ${success ? "border-green-500" : "border-red-500"}
                  overflow-hidden cursor-pointer hover:bg-gray-50
                `}
              >
              {/* Info utama */}
              <div className="flex-1 px-4 py-3">
                {/* ID (italic) */}
                <div className="text-xs text-gray-500 italic mb-1">
                  {tx.id}
                </div>
                {/* Tanggal & jam */}
                <div className="text-sm font-semibold mb-3">
                  {tx.formattedDate || tx.date || "Tanggal tidak tersedia"}{" "}
                  <span className="font-normal">|</span> {tx.time || "Waktu tidak tersedia"}
                </div>
                {/* Definition list */}
                <dl className="text-sm text-gray-700 space-y-2">
                  <div className="flex">
                    <dt className="w-20 font-medium">Total</dt>
                    <dd className="flex-1 font-semibold">
                      Rp{(tx.total || tx.totalPrice || 0).toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-20 font-medium">Jumlah</dt>
                    <dd className="flex-1 font-semibold">
                      {tx.items || tx.timeSlots?.length || 1} Pesanan
                    </dd>
                  </div>
                  <div>
                    <dt className="block font-medium">Tempat</dt>
                    <dd className="mt-0.5 font-semibold">{tx.venue || tx.venueSubtitle || tx.arenaName || "Tempat tidak tersedia"}</dd>
                  </div>
                </dl>
              </div>

              {/* Status badge */}
              <div className="flex items-start px-3 pt-3">
                <span
                  className={`
                    text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap
                    ${success
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"}
                  `}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          );
          })
        )}
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}
