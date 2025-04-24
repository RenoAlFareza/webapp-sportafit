// src/pages/payment/ConfirmPayment.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function ConfirmPayment() {
  const navigate = useNavigate();

  // misal basePrice diambil dari params atau context, di-hardcode dulu
  const BASE_PRICE = 243000; // contoh total sebelum asuransi
  const INSURANCE_FEE = 2000;

  const [withInsurance, setWithInsurance] = useState(false);

  // total akhir
  const total = BASE_PRICE + (withInsurance ? INSURANCE_FEE : 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-jakarta">

      {/* Header */}
      <div className="bg-sporta-blue px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="text-white">
          <IoArrowBack size={24} />
        </button>
        <h1 className="flex-1 text-center text-white font-semibold text-lg">
          Konfirmasi Pembayaran
        </h1>
        <div className="w-6" />
      </div>

      {/* Konten Utama */}
      <div className="flex-1 px-4 py-6 space-y-6">

        {/* Proteksi Batal Booking */}
        <div className="bg-white rounded-xl shadow-lg px-4 py-3 flex items-start justify-between">
          <label className="flex-1 flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={withInsurance}
              onChange={() => setWithInsurance(v => !v)}
              className="mt-1 w-4 h-4"
            />
            <div>
              <div className="font-semibold text-gray-800">Proteksi Batal Booking</div>
              <div className="text-xs text-gray-600">
                Kompensasi hingga 100% jika batal booking!
              </div>
            </div>
          </label>
          <div className="font-semibold text-gray-800">
            Rp {INSURANCE_FEE.toLocaleString()}
          </div>
        </div>
        <div className="px-4 text-xs text-gray-500">
          Dengan membeli, kamu setuju dengan{" "}
          <button
            onClick={() => navigate("/terms")}
            className="underline text-sporta-blue"
          >
            Syarat &amp; Ketentuan
          </button>{" "}
          kami.
        </div>

        {/* Rincian Pembayaran */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-3">
            <div className="text-sm font-semibold text-gray-800">Rincian Pembayaran</div>
          </div>
          <div className="px-4 py-3 space-y-2">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Total Harga</span>
              <span className="font-semibold">Rp {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tombol Bawah Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg py-4 px-4">
        <button
          onClick={() => navigate("/pembayaran-sukses")}
          className="w-full bg-sporta-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Bayar Rp {total.toLocaleString()}
        </button>
      </div>
    </div>
  );
}
