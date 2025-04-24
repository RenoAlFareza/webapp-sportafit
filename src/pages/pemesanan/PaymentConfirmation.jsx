import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function KonfirmasiPembayaran() {
  const navigate = useNavigate();
  const [protection, setProtection] = useState(false);

  // Harga
  const hargaProteksi = 2000;
  const hargaPokok = 243000;
  const hargaTotal = hargaPokok + (protection ? hargaProteksi : 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-jakarta pb-24">
      {/* Header Fixed */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow flex items-center h-16 px-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-600">
          <IoArrowBack size={22} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold">
          Konfirmasi Pembayaran
        </h1>
        <div className="w-8" />
      </div>

      <div className="pt-20 px-4">
        {/* Rincian Pembayaran */}
        <div className="bg-white rounded-xl shadow-md p-0 overflow-hidden">
          <div className="px-4 pt-4 pb-1 text-base font-bold">Rincian Pembayaran</div>
          <div className="border-t border-gray-100" />

          {/* Proteksi/Asuransi */}
          <label className="flex items-start gap-3 px-4 py-4">
            <input
              type="checkbox"
              checked={protection}
              onChange={() => setProtection(!protection)}
              className="w-5 h-5 mt-1 accent-blue-600"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">Proteksi Batal Booking</span>
                <span className="font-medium text-blue-600">Rp {hargaProteksi.toLocaleString()}</span>
              </div>
              <span className="text-xs text-gray-500">Kompensasi hingga 100% jika batal booking!</span>
            </div>
          </label>
          <div className="border-t border-gray-100" />

          {/* Total Harga */}
          <div className="flex items-center justify-between px-4 py-4">
            <span className="font-semibold">Total Harga</span>
            <span className="font-bold text-base">Rp {hargaTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* S&K */}
        <div className="mt-4 text-xs text-gray-500 px-1">
          Dengan membeli, kamu setuju dengan <a href="#" className="text-blue-600 underline">Syarat & Ketentuan</a> kami.
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed left-0 right-0 bottom-0 z-30 px-4 py-4 bg-white shadow-xl">
        <button
          onClick={() => navigate("/pembayaran-sukses")}
          className="w-full bg-blue-600 text-white font-bold text-lg py-3 rounded-lg shadow active:bg-blue-700 transition"
        >
          Bayar Rp {hargaTotal.toLocaleString()}
        </button>
      </div>
    </div>
  );
}
