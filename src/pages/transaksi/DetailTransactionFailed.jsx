// src/pages/transaksi/DetailTransactionFailed.jsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const mockTx = {
  id: "INV-250408-ELKIDWAC52-26",
  date: "Selasa, 08 April 2025",
  time: "17:00 – 21:00",
  venue: "BASKET BABATAN, SURABAYA",
  activity: "Basket",
  user: {
    name: "Fajar Nugros",
    email: "designgraphic.fernando@gmail.com",
    phone: "0822-3374-4650",
  },
  payment: {
    method: "GoPay",
    status: "Gagal",
    price: 500000,
    promo: 0,
    fee: 5000,
    total: 505000,
  },
};

export default function DetailTransactionFailed() {
  const navigate = useNavigate();
  const { id } = useParams(); // nantinya pakai untuk fetch

  const tx = mockTx; // ganti dengan data hasil fetch

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

        {/* Status Gagal */}
        <div className="rounded-lg bg-red-500 text-white text-center py-1">
          Gagal
        </div>

        {/* ID & Waktu */}
        <section className="space-y-1">
          <div className="text-sm">
            <span className="font-semibold">ID Pembayaran:</span> {tx.id}
          </div>
          <div className="text-sm text-gray-600">
            {tx.date} | {tx.time}
          </div>
        </section>

        {/* Tempat */}
        <section className="space-y-1">
          <div className="text-sm font-semibold">Tempat</div>
          <div className="text-sm">{tx.venue}</div>
        </section>

        {/* Aktivitas + Invoice */}
        <section className="flex items-center justify-between">
          <div className="text-sm font-semibold">{tx.activity}</div>
          <button
            onClick={() => navigate(`/invoice-failed/${tx.id}`)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Lihat Invoice
          </button>
        </section>

        <div className="border-b border-gray-200 my-4" />

        {/* Data Pengguna */}
        <section className="bg-white rounded-2xl shadow px-4 py-4 space-y-3">
          <div>
            <div className="text-xs text-gray-500">Nama</div>
            <div className="text-sm">{tx.user.name}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Email</div>
            <div className="text-sm">{tx.user.email}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">No. HP</div>
            <div className="text-sm">{tx.user.phone}</div>
          </div>
        </section>

        <div className="border-b border-gray-200 my-4" />

        {/* Ringkasan Pemesanan */}
        <section className="bg-gray-100 rounded-2xl px-4 py-4 space-y-3">
          <div className="text-sm font-semibold">Ringkasan Pemesanan</div>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Metode Pembayaran</span>
              <span className="font-medium">{tx.payment.method}</span>
            </div>
            <div className="flex justify-between">
              <span>Status Pembayaran</span>
              <span className="font-medium">{tx.payment.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Harga</span>
              <span className="font-medium">
                Rp{tx.payment.price.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Promo</span>
              <span className="font-medium">
                Rp{tx.payment.promo.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Layanan</span>
              <span className="font-medium">
                Rp{tx.payment.fee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Pembayaran</span>
              <span className="font-semibold">
                Rp{tx.payment.total.toLocaleString()}
              </span>
            </div>
          </div>
        </section>

        {/* Ringkasan Lapangan */}
        <section className="bg-white rounded-2xl shadow px-4 py-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-sm font-semibold">{tx.activity}</div>
              <div className="text-xs text-gray-600">
                {tx.date} | {tx.time}
              </div>
            </div>
            <div className="text-sm font-semibold">
              Rp{tx.payment.price.toLocaleString()}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
