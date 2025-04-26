// src/pages/transaksi/DetailTransaction.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { getBookingById } from "../../services/bookingHistoryService";

// Fallback data jika tidak ada data transaksi
const mockTx = {
  id: "INV-250406-ELSJXUC52-46",
  date: "Minggu, 06 April 2025",
  time: "20:00 – 23:00",
  venue: "BADMINTON ZUPER KEPUTIH, SURABAYA",
  activity: "Badminton",
  user: {
    name: "Fajar Nugros",
    email: "designgraphic.fernando@gmail.com",
    phone: "0822-3374-4650",
  },
  payment: {
    method: "DANA",
    status: "LUNAS",
    price: 180000,
    promo: 0,
    fee: 5000,
    total: 185000,
  },
};

export default function DetailTransaction() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil data transaksi berdasarkan ID
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        console.log('Fetching transaction with ID:', id);

        // Ambil data transaksi dari localStorage
        const data = getBookingById(id);
        console.log('Transaction data from localStorage:', data);

        if (data) {
          // Tambahkan properti default jika tidak ada
          const enhancedData = {
            ...data,
            // Pastikan properti yang dibutuhkan ada
            status: data.status || 'Berhasil',
            totalPrice: data.totalPrice || 0,
            serviceFee: data.serviceFee || 5000,
            // Tambahkan properti payment jika tidak ada
            payment: data.payment || {
              method: data.paymentMethod || 'DANA',
              status: data.status || 'LUNAS',
              price: data.totalPrice || 0,
              promo: data.promo || 0,
              fee: data.serviceFee || 5000,
              total: data.total || data.totalPrice + (data.serviceFee || 5000) || 0
            }
          };

          console.log('Enhanced transaction data:', enhancedData);
          setTransaction(enhancedData);
        } else {
          console.log('Transaction not found, using mock data');
          setTransaction(mockTx);
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
        setTransaction(mockTx);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  // Jika data belum diambil, tampilkan loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Gunakan data transaksi dari localStorage atau fallback ke mock data
  const tx = transaction || mockTx;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-jakarta">

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#F9FAFB] z-30 shadow-sm">
        <div className="max-w-[434px] mx-auto flex items-center px-4 py-4">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-600">
            <IoArrowBack size={24} />
          </button>
          <h1 className="flex-1 text-center text-xl font-bold">
            Detail Transaksi
          </h1>
          <div className="w-6" />
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="pt-20 pb-24 max-w-[434px] mx-auto px-4 space-y-6">

        {/* Status */}
        <div className="rounded-lg bg-green-500 text-white text-center py-1">
          {tx.status || "Berhasil"}
        </div>

        {/* ID & Waktu */}
        <section className="space-y-1">
          <div className="text-sm">
            <span className="font-semibold">ID Pembayaran:</span> {tx.id}
          </div>
          <div className="text-sm text-gray-600">
            {tx.formattedDate || tx.date} | {tx.time}
          </div>
        </section>

        {/* Tempat */}
        <section className="space-y-1">
          <div className="text-sm font-semibold">Tempat</div>
          <div className="text-sm">{tx.venueSubtitle || tx.venue}</div>
        </section>

        {/* Aktivitas + Invoice */}
        <section className="flex items-center justify-between">
          <div className="text-sm font-semibold">{tx.activity || "Badminton"}</div>
          <button
            onClick={() => navigate(`/invoice/${tx.id}`)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Lihat Invoice
          </button>
        </section>

        <div className="border-b border-gray-200 my-4" />

        {/* Data Pengguna */}
        {tx.user ? (
          <section className="bg-white rounded-2xl shadow px-4 py-4 space-y-3">
            <div>
              <div className="text-xs text-gray-500">Nama</div>
              <div className="text-sm">{tx.user.name || "Tidak tersedia"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="text-sm">{tx.user.email || "Tidak tersedia"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">No. HP</div>
              <div className="text-sm">{tx.user.phone || "Tidak tersedia"}</div>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-2xl shadow px-4 py-4 space-y-3">
            <div className="text-sm text-center text-gray-500">
              Data pengguna tidak tersedia
            </div>
          </section>
        )}

        <div className="border-b border-gray-200 my-4" />

        {/* Ringkasan Pemesanan */}
        <section className="bg-gray-100 rounded-2xl px-4 py-4 space-y-3">
          <div className="text-sm font-semibold">Ringkasan Pemesanan</div>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Metode Pembayaran</span>
              <span className="font-medium">{tx.paymentMethod || tx.payment?.method || "DANA"}</span>
            </div>
            <div className="flex justify-between">
              <span>Status Pembayaran</span>
              <span className="font-medium">{tx.status || tx.payment?.status || "LUNAS"}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Harga</span>
              <span className="font-medium">
                Rp{(tx.totalPrice || tx.payment?.price || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Promo</span>
              <span className="font-medium">
                Rp{(tx.promo || tx.payment?.promo || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Layanan</span>
              <span className="font-medium">
                Rp{(tx.serviceFee || tx.payment?.fee || 5000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Pembayaran</span>
              <span className="font-semibold">
                Rp{(tx.total || tx.payment?.total || (tx.totalPrice + (tx.serviceFee || 5000)) || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </section>

        {/* Ringkasan Lapangan */}
        <section className="bg-white rounded-2xl shadow px-4 py-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-sm font-semibold">{tx.activity || "Badminton"}</div>
              <div className="text-xs text-gray-600">
                {tx.formattedDate || tx.date} | {tx.time}
              </div>
            </div>
            <div className="text-sm font-semibold">
              Rp{(tx.totalPrice || tx.payment?.price || 0).toLocaleString()}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
