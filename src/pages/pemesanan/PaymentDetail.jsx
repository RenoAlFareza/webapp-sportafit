// src/pages/pemesanan/PaymentDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { PaymentContext } from "../../context/PaymentContext";
import danaLogo from "/dana2.png"; // Tambahkan import untuk logo DANA

const mockBooking = {
  arenaName:  "Zuper Badminton Keputih",
  location:   "Zuper Badminton Keputih, Surabaya",
  date:       "Sabtu, 19 April 2025",
  time:       "19:00 - 22:00",
  price:      240000,
  serviceFee: 5000,
};

export default function PaymentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();              // ambil id reservation
  const { methods } = useContext(PaymentContext);

  const [timeLeft, setTimeLeft] = useState(900);
  const [expanded, setExpanded] = useState(false);
  const [method, setMethod] = useState(null);

  // Hitung mundur 15 menit
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = sec => {
    const m = Math.floor(sec/60), s = sec%60;
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };

  const total = mockBooking.price + mockBooking.serviceFee;

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 pt-6 pb-32 font-jakarta">
      {/* Header: Back selalu kembali ke page sebelumnya */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-600">
          <IoArrowBack size={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">
          Detail Pembayaran
        </h1>
        <div className="w-6" />
      </div>

      {/* Timer */}
      <div className="bg-red-100 text-red-700 text-xs rounded-lg p-3 mb-4">
        Periksa transaksi dan bayar dalam{" "}
        <span className="font-medium">{formatTime(timeLeft)}</span>
      </div>
      <hr className="border-gray-300 mb-4" />

      {/* Ringkasan Booking */}
      <div className="bg-white rounded-xl shadow px-4 py-3 mb-4">
        <div className="flex justify-between">
          <div>
            <div className="text-sm font-semibold">{mockBooking.arenaName}</div>
            <div className="text-xs text-gray-600">
              {mockBooking.date} | {mockBooking.time}
            </div>
          </div>
          <div className="text-sm font-semibold">
            Rp{mockBooking.price.toLocaleString()}
          </div>
        </div>
      </div>
      <hr className="border-gray-300 mb-4" />

      {/* Ringkasan Pemesanan */}
      <div className="bg-white rounded-xl shadow px-4 py-4 mb-4 space-y-2">
        <div className="text-sm font-semibold">Ringkasan Pemesanan</div>
        {[
          ["Metode Pembayaran",  method?.name  ?? "–"],
          ["Pilihan Pembayaran", method       ? "Pembayaran Penuh" : "–"],
          ["Total Harga",        `Rp${mockBooking.price.toLocaleString()}`],
          ["Promo",              "Rp0"],
          ["Biaya Layanan",      `Rp${mockBooking.serviceFee.toLocaleString()}`],
          ["Total Pembayaran",   `Rp${total.toLocaleString()}`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between text-xs text-gray-700">
            <span>{label}</span>
            <span className={label === "Total Pembayaran" ? "font-semibold" : ""}>
              {value}
            </span>
          </div>
        ))}
      </div>
      <hr className="border-gray-300 mb-4" />

      {/* Pilih Metode Pembayaran */}
      <div className="bg-white rounded-xl shadow mb-28">
        <button
          className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium"
          onClick={() => setExpanded(v => !v)}
        >
          {method
            ? `${method.name} - Rp${method.balance.toLocaleString()}`
            : "Pilih Metode Pembayaran"}
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expanded && (
          <div className="px-4 pb-4 space-y-2">
            {methods.map(pm => {
              const insufficient = pm.balance < total;
              return (
                <button
                  key={pm.id}
                  disabled={insufficient}
                  onClick={() => {
                    setMethod(pm);
                    setExpanded(false);
                  }}
                  className={`
                    w-full flex items-center justify-between rounded-lg px-3 py-2
                    ${insufficient
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <img src={pm.name === "DANA" ? danaLogo : pm.icon} alt={pm.name} className="w-6 h-6" />
                    <span className="text-sm">{pm.name}</span>
                  </div>
                  <span className="text-xs">
                    Rp{pm.balance.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {!expanded && method && (
          <div className="px-4 pb-4">
            <button
              onClick={() => setExpanded(true)}
              className="w-full bg-sporta-blue text-white py-2 rounded-lg text-sm font-medium"
            >
              Ganti
            </button>
          </div>
        )}
      </div>

      {/* Bottom Bar: lanjutkan ke konfirmasi */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl py-3 px-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-600">Rincian Pembayaran</div>
            <div className="text-xl font-semibold">
              Rp{total.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => navigate("/konfirmasi-pembayaran")}
            className="w-32 bg-sporta-blue text-white py-2 rounded-lg font-medium disabled:opacity-50"
            disabled={!method}
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
