// src/pages/pemesanan/PaymentDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack, IoTicketOutline, IoChevronForward } from "react-icons/io5";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { PaymentContext } from "../../context/PaymentContext";
import { useVoucher } from "../../context/VoucherContext";
import { getBookingById, getRemainingTime, formatTime, moveBookingToTransaction } from "../../services/bookingHistoryService";
import danaLogo from "/dana2.png"; // Tambahkan import untuk logo DANA
import ovoLogo from "/ovo.png"; // Tambahkan import untuk logo OVO
import gopayLogo from "/gopay.png"; // Tambahkan import untuk logo GoPay

// Fallback data jika tidak ada data booking
const fallbackBooking = {
  id: "INV-000000-XXXXXX-00",
  arenaName: "Zuper Badminton Keputih",
  venueSubtitle: "Zuper Badminton Keputih, Surabaya",
  formattedDate: "Sabtu, 19 April 2025",
  time: "19:00 - 22:00",
  totalPrice: 240000,
  serviceFee: 5000,
  expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString()
};

export default function PaymentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();              // ambil id transaksi
  const { methods } = useContext(PaymentContext);
  const { userVouchers, calculateDiscount } = useVoucher();

  const [timeLeft, setTimeLeft] = useState(900); // Default 15 menit
  const [expanded, setExpanded] = useState(false);
  const [method, setMethod] = useState(null);
  const [booking, setBooking] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showVoucherList, setShowVoucherList] = useState(false);

  // Ambil data booking berdasarkan ID transaksi
  useEffect(() => {
    // Coba ambil dari localStorage dulu (untuk booking yang baru dibuat)
    const currentBooking = localStorage.getItem('currentBooking');
    if (currentBooking) {
      const parsedBooking = JSON.parse(currentBooking);
      if (parsedBooking.id === id) {
        setBooking(parsedBooking);

        // Hitung sisa waktu
        const remainingSeconds = getRemainingTime(parsedBooking.expiryTime);
        setTimeLeft(remainingSeconds);
        return;
      }
    }

    // Jika tidak ada di localStorage, cari di booking history
    const bookingData = getBookingById(id);
    if (bookingData) {
      setBooking(bookingData);

      // Hitung sisa waktu
      const remainingSeconds = getRemainingTime(bookingData.expiryTime);
      setTimeLeft(remainingSeconds);
    } else {
      // Jika tidak ditemukan, gunakan fallback
      setBooking(fallbackBooking);
    }
  }, [id]);

  // Hitung mundur sisa waktu
  useEffect(() => {
    if (timeLeft <= 0) {
      // Jika waktu habis, pindahkan booking ke transaksi dengan status "Kadaluarsa"
      if (booking && booking.id) {
        // Pindahkan booking ke transaksi
        console.log('Booking expired, moving to transaction:', booking.id);
        const result = moveBookingToTransaction(booking.id, "Kadaluarsa");
        console.log('Move expired booking result:', result);

        // Redirect ke halaman detail transaksi gagal
        navigate(`/transaksi/failed/${booking.id}`);
      } else {
        // Jika tidak ada booking, redirect ke halaman riwayat pemesanan
        navigate("/pemesanan");
      }
      return;
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, booking, navigate]);

  // Hitung total harga
  const price = booking?.totalPrice || fallbackBooking.totalPrice;

  // Gunakan biaya layanan dari booking data atau default ke 5000
  const serviceFee = booking?.serviceFee || 5000;

  // Hitung diskon dari voucher yang dipilih
  const discount = selectedVoucher ? calculateDiscount(selectedVoucher, price) : 0;

  // Hitung total harga
  const total = price + serviceFee - discount;

  console.log('Price details in payment detail:', {
    price,
    serviceFee,
    discount,
    total,
    bookingPrice: booking?.totalPrice,
    bookingServiceFee: booking?.serviceFee,
    pricePerHour: booking?.pricePerHour,
    timeSlots: booking?.timeSlots,
    selectedVoucher
  });

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

      {/* ID Transaksi */}
      <div className="bg-white rounded-xl shadow px-4 py-3 mb-4">
        <div className="text-xs text-gray-600 mb-1">ID Transaksi:</div>
        <div className="text-sm font-semibold">{booking?.id || fallbackBooking.id}</div>
      </div>

      {/* Ringkasan Booking */}
      <div className="bg-white rounded-xl shadow px-4 py-3 mb-4">
        <div className="flex justify-between">
          <div>
            <div className="text-sm font-semibold">{booking?.arenaName || fallbackBooking.arenaName}</div>
            <div className="text-xs text-gray-600">
              {booking?.formattedDate || booking?.date || fallbackBooking.formattedDate} | {booking?.time || fallbackBooking.time}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {booking?.courtName || "Lapangan 1"}
            </div>
          </div>
          <div className="text-sm font-semibold">
            Rp{price.toLocaleString()}
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
          ["Total Harga",        `Rp${price.toLocaleString()}`],
          ["Promo",              discount > 0 ? `-Rp${discount.toLocaleString()}` : "Rp0"],
          ["Biaya Layanan",      `Rp${serviceFee.toLocaleString()}`],
          ["Total Pembayaran",   `Rp${total.toLocaleString()}`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between text-xs text-gray-700">
            <span>{label}</span>
            <span className={
              label === "Total Pembayaran"
                ? "font-semibold"
                : label === "Promo" && discount > 0
                  ? "text-green-600 font-medium"
                  : ""
            }>
              {value}
            </span>
          </div>
        ))}

        {/* Voucher Button */}
        <div className="pt-2">
          <button
            onClick={() => setShowVoucherList(!showVoucherList)}
            className={`w-full flex justify-between items-center py-2 px-3 ${selectedVoucher ? 'bg-green-50 border border-green-200' : 'bg-gray-100'} rounded-lg text-sm`}
          >
            <div className="flex items-center gap-2">
              <IoTicketOutline size={18} className={selectedVoucher ? 'text-green-600' : 'text-sporta-blue'} />
              <span>{selectedVoucher ? `${selectedVoucher.title} (${selectedVoucher.discountType === 'percentage' ? `${selectedVoucher.discountValue}%` : `Rp${selectedVoucher.discountValue.toLocaleString()}`})` : 'Gunakan Voucher'}</span>
            </div>
            <IoChevronForward size={18} className="text-gray-400" />
          </button>

          {/* Voucher List */}
          {showVoucherList && (
            <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
              {userVouchers.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  <IoTicketOutline size={24} className="mx-auto mb-2 text-gray-400" />
                  <p>Anda belum memiliki voucher</p>
                  <button
                    onClick={() => navigate("/voucher")}
                    className="mt-2 px-4 py-1 bg-sporta-blue text-white rounded-full text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    Lihat Voucher
                  </button>
                </div>
              ) : (
                <>
                  {/* Option to remove voucher if one is selected */}
                  {selectedVoucher && (
                    <button
                      onClick={() => {
                        setSelectedVoucher(null);
                        setShowVoucherList(false);
                      }}
                      className="w-full p-3 text-left border-b border-gray-200 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-red-600 font-medium">Hapus Voucher</span>
                      </div>
                    </button>
                  )}

                  {/* List of available vouchers */}
                  {userVouchers.filter(v => !v.isUsed).map(voucher => {
                    // Calculate potential discount
                    const potentialDiscount = calculateDiscount(voucher, price);
                    const isEligible = potentialDiscount > 0;

                    return (
                      <button
                        key={voucher.id}
                        onClick={() => {
                          if (isEligible) {
                            setSelectedVoucher(voucher);
                            setShowVoucherList(false);
                          }
                        }}
                        disabled={!isEligible}
                        className={`w-full p-3 text-left border-b border-gray-200 ${
                          !isEligible
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : selectedVoucher?.id === voucher.id
                              ? 'bg-green-50'
                              : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">{voucher.title}</div>
                            <div className="text-xs text-gray-500">
                              {voucher.discountType === 'percentage'
                                ? `Diskon ${voucher.discountValue}% hingga Rp${voucher.maxDiscount?.toLocaleString() || 'tidak terbatas'}`
                                : `Diskon tetap Rp${voucher.discountValue.toLocaleString()}`
                              }
                            </div>
                            {!isEligible && (
                              <div className="text-xs text-red-500 mt-1">
                                Min. pembelian Rp{voucher.minPurchase.toLocaleString()}
                              </div>
                            )}
                          </div>
                          {isEligible && (
                            <div className="text-xs font-medium text-green-600">
                              -Rp{potentialDiscount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
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
                    <img src={pm.name === "DANA" ? danaLogo : pm.name === "OVO" ? ovoLogo : pm.name === "GoPay" ? gopayLogo : pm.icon} alt={pm.name} className="w-6 h-6" />
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
            onClick={() => {
              if (method && booking) {
                // Update booking data dengan metode pembayaran dan total harga
                const updatedBooking = {
                  ...booking,
                  paymentMethod: method.name,
                  totalPrice: price,
                  serviceFee: serviceFee,
                  discount: discount,
                  voucherId: selectedVoucher?.id,
                  voucherCode: selectedVoucher?.code,
                  voucherTitle: selectedVoucher?.title,
                  total: total
                };

                // Simpan ke localStorage untuk halaman konfirmasi pembayaran
                localStorage.setItem('currentBooking', JSON.stringify(updatedBooking));

                // Navigasi ke halaman konfirmasi pembayaran
                navigate("/konfirmasi-pembayaran");
              }
            }}
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
