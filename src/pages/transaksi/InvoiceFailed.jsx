// src/pages/pemesanan/InvoiceFailed.jsx

import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import logo from "/Logo.png"; // sesuaikan path

export default function InvoiceFailed() {
  const navigate = useNavigate();
  const { id } = useParams();
  const invoiceRef = useRef();

  // Mock data untuk versi gagal
  const invoice = {
    id: id || "INV-250408-ELKIDWAC52-26",
    transactionDate: "08-04-2025 17:00:00",
    dueDate:         "08-04-2025 17:15:00",
    orderStatus:    "Gagal",
    paymentStatus:  "Gagal",
    customer: {
      name:  "Fernando Young",
      phone: "081211307064",
    },
    venue: {
      name:    "Basket Babatan",
      address: "Jl. Babatan Indah No.5, Surabaya",
      phone:   "085234278657",
    },
    items: [
      {
        activity: "Basket",
        product:  "Lapangan Outdoor",
        date:     "08-04-2025",
        time:     "17:00 - 18:00",
        price:    50000,
      },
    ],
    fee:      5000,
    promo:    0,
  };

  const subTotal = invoice.items.reduce((sum, it) => sum + it.price, 0);
  const total    = subTotal + invoice.fee - invoice.promo;

  const isSuccess = false; // karena ini versi gagal

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-jakarta px-4 pt-6 pb-12">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-600">
          <IoArrowBack size={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">
          Invoice <span className="font-mono">#{invoice.id}</span>
        </h1>
        <button
          onClick={handlePrint}
          className="text-blue-600 text-sm font-medium"
        >
          Unduh
        </button>
      </div>

      {/* Container Cetak */}
      <div
        ref={invoiceRef}
        className="max-w-[434px] mx-auto bg-white rounded-2xl p-6 shadow print:shadow-none print:bg-transparent"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Sporta Fit" className="w-24" />
        </div>

        {/* Status Bar Merah */}
        <div className="text-center text-white py-1 mb-6 bg-red-500 rounded-full">
          Gagal
        </div>

        {/* Header Info */}
        <div className="text-center text-xs text-gray-500 mb-1">
          Sporta Fit Indonesia
        </div>
        <div className="text-center text-sm font-mono font-semibold mb-6">
          #{invoice.id}
        </div>

        {/* Grid Tanggal & Status */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm mb-6">
          <div>
            <div className="font-medium">Tanggal Transaksi</div>
            <div>{invoice.transactionDate}</div>
          </div>
          <div>
            <div className="font-medium">Status Pesanan</div>
            <div className="text-red-600">{invoice.orderStatus}</div>
          </div>
          <div>
            <div className="font-medium">Batas Waktu Bayar</div>
            <div>{invoice.dueDate}</div>
          </div>
          <div>
            <div className="font-medium">Status Pembayaran</div>
            <div className="text-red-600">{invoice.paymentStatus}</div>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Tagihan & Pembayaran Untuk */}
        <div className="grid grid-cols-2 gap-x-6 mb-6 text-sm">
          <div>
            <div className="font-medium text-gray-600 mb-1">Tagihan Untuk</div>
            <div className="font-semibold">{invoice.customer.name}</div>
            <div>{invoice.customer.phone}</div>
          </div>
          <div>
            <div className="font-medium text-gray-600 mb-1">Pembayaran Untuk</div>
            <div className="font-semibold">{invoice.venue.name}</div>
            <div>{invoice.venue.address}</div>
            <div>{invoice.venue.phone}</div>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Tabel Item */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-sporta-blue text-white">
                {["No", "Aktivitas", "Produk", "Tanggal", "Jam", "Harga"].map((h) => (
                  <th key={h} className="px-2 py-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((it, i) => (
                <tr key={i} className="border-b">
                  <td className="px-2 py-2">{i + 1}</td>
                  <td className="px-2 py-2">{it.activity}</td>
                  <td className="px-2 py-2">{it.product}</td>
                  <td className="px-2 py-2">{it.date}</td>
                  <td className="px-2 py-2">{it.time}</td>
                  <td className="px-2 py-2">Rp{it.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Ringkasan Biaya */}
        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>Rp{subTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Jasa Tambahan</span>
            <span>Rp{invoice.fee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Promo</span>
            <span className="text-red-500">- Rp{invoice.promo.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total Pembayaran</span>
            <span>Rp{total.toLocaleString()}</span>
          </div>
        </div>

        <hr className="border-gray-200 mb-4" />

        {/* Catatan */}
        <div className="text-xs text-gray-500">
          **Catatan: Ini adalah tanda terima yang dihasilkan sistem dan tidak
          memerlukan tanda tangan fisik.
        </div>
      </div>
    </div>
  );
}
