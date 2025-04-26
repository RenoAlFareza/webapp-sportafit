// src/pages/transaksi/ListTransaksi.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import BottomNavbar from "../main_menu/BottomNavbar";
import { getTransactions } from "../../services/bookingHistoryService";

export default function ListTransaksi() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data transaksi dari localStorage
  useEffect(() => {
    // Ambil semua transaksi
    const allTransactions = getTransactions();
    console.log('Transactions in ListTransaksi:', allTransactions);
    setTransactions(allTransactions);
    setLoading(false);
  }, []);

  // Fungsi untuk menampilkan status dengan warna yang sesuai
  const renderStatus = (status) => {
    let bgColor, textColor;

    switch (status) {
      case "Berhasil":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "Kadaluarsa":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      default:
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
    }

    return (
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

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
              Riwayat Transaksi
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
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Tidak ada riwayat transaksi</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => navigate(`/detail-transaksi/${tx.id}`)}
              className="bg-white rounded-2xl shadow px-4 py-4 flex justify-between items-start"
            >
              {/* Detail */}
              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  <span className="font-semibold">ID Transaksi:</span> {tx.id}
                </div>
                <div className="text-sm font-semibold uppercase">
                  {tx.activity} – {tx.venueTitle}
                </div>
                <div className="text-xs text-gray-600">{tx.activity}</div>
                <div className="text-xs text-gray-600">{tx.venueSubtitle}</div>
                <div className="text-xs text-gray-600">{tx.formattedDate || tx.date}</div>
                <div className="text-xs text-gray-600">{tx.time}</div>

                {/* Tanggal Transaksi */}
                {tx.completedAt && (
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(tx.completedAt).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </div>

              {/* Status */}
              {renderStatus(tx.status)}
            </div>
          ))
        )}
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}
