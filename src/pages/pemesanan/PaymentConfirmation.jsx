import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { moveBookingToTransaction, getBookingHistory, getTransactions } from "../../services/bookingHistoryService";
import { hasPin, savePin, verifyPin } from "../../services/pinService";
import PinModal from "../../components/PinModal";

// Fallback data jika tidak ada data booking
const fallbackBooking = {
  arenaName: "Zuper Badminton Keputih",
  location: "Zuper Badminton Keputih, Surabaya",
  date: "Sabtu, 19 April 2025",
  time: "19:00 - 22:00",
  price: 240000,
  serviceFee: 5000,
};

export default function KonfirmasiPembayaran() {
  const navigate = useNavigate();
  const [protection, setProtection] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isPinNew, setIsPinNew] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pinError, setPinError] = useState("");

  // Ambil data booking dari localStorage
  useEffect(() => {
    // Coba ambil dari currentBooking (dari PaymentDetail.jsx)
    const currentBooking = localStorage.getItem('currentBooking');
    if (currentBooking) {
      console.log('Found currentBooking data:', currentBooking);
      setBookingData(JSON.parse(currentBooking));
      return;
    }

    // Fallback ke bookingData (untuk kompatibilitas)
    const storedBookingData = localStorage.getItem('bookingData');
    if (storedBookingData) {
      console.log('Found bookingData data:', storedBookingData);
      setBookingData(JSON.parse(storedBookingData));
    }
  }, []);

  // Gunakan data booking dari localStorage atau fallback
  const booking = bookingData || fallbackBooking;

  // Hitung harga
  const hargaProteksi = 2000;

  // Gunakan harga dari booking data
  const price = booking.totalPrice || booking.price || 0;

  // Gunakan biaya layanan dari booking data atau default ke 5000
  const serviceFee = booking.serviceFee || 5000;

  // Gunakan diskon dari voucher jika ada
  const discount = booking.discount || 0;

  // Hitung total harga pokok (harga lapangan + biaya layanan - diskon)
  const hargaPokok = price + serviceFee - discount;

  // Hitung total harga dengan proteksi jika dipilih
  const hargaTotal = hargaPokok + (protection ? hargaProteksi : 0);

  console.log('Price details in confirmation:', {
    price,
    serviceFee,
    discount,
    hargaPokok,
    hargaProteksi,
    hargaTotal,
    bookingPrice: booking.totalPrice,
    bookingTotal: booking.total,
    voucherInfo: booking.voucherTitle ? {
      id: booking.voucherId,
      code: booking.voucherCode,
      title: booking.voucherTitle
    } : null
  });

  // Fungsi untuk menangani klik tombol bayar
  const handlePayButtonClick = async () => {
    try {
      // Cek apakah pengguna sudah memiliki PIN
      const userHasPin = await hasPin();

      // Jika belum punya PIN, tampilkan modal untuk membuat PIN baru
      if (!userHasPin) {
        setIsPinNew(true);
      } else {
        setIsPinNew(false);
      }

      // Tampilkan modal PIN
      setShowPinModal(true);
    } catch (error) {
      console.error("Error checking PIN:", error);
      alert("Terjadi kesalahan saat memeriksa PIN. Silakan coba lagi.");
    }
  };

  // Fungsi untuk menangani submit PIN
  const handlePinSubmit = async (pin, isNewPin = false) => {
    // Validasi PIN terlebih dahulu
    if (pin.length !== 6) {
      setPinError("PIN harus terdiri dari 6 digit");
      return;
    }

    setIsProcessing(true);
    setPinError("");

    try {
      // Jika membuat PIN baru
      if (isNewPin) {
        console.log("Creating new PIN:", pin);
        const success = await savePin(pin);
        if (success) {
          processPayment();
        } else {
          setPinError("Gagal menyimpan PIN. Silakan coba lagi.");
          setIsProcessing(false);
        }
      } else {
        // Verifikasi PIN
        console.log("Verifying PIN:", pin);

        // Untuk debugging, cek PIN yang tersimpan di localStorage
        const savedPin = localStorage.getItem('user_pin');
        console.log("Saved PIN in localStorage:", savedPin);

        const isPinValid = await verifyPin(pin);
        console.log("PIN verification result:", isPinValid);

        if (isPinValid) {
          processPayment();
        } else {
          setPinError("PIN yang Anda masukkan tidak valid. Silakan coba lagi.");
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error("Error processing PIN:", error);
      setPinError("Terjadi kesalahan. Silakan coba lagi.");
      setIsProcessing(false);
    }
  };

  // Fungsi untuk memproses pembayaran setelah PIN diverifikasi
  const processPayment = () => {
    try {
      // Simpan data pembayaran termasuk proteksi ke localStorage
      const paymentData = {
        ...booking,
        protection: protection,
        protectionFee: protection ? hargaProteksi : 0,
        totalPrice: hargaTotal,
        paymentDate: new Date().toISOString(),
        status: "Berhasil",
        id: booking.id // Pastikan ID tersimpan dengan benar
      };
      localStorage.setItem('paymentData', JSON.stringify(paymentData));

      // Log untuk debugging
      console.log('Payment data saved to localStorage:', paymentData);

      // Pindahkan booking ke transaksi dengan status "Berhasil"
      if (booking.id) {
        try {
          console.log('Booking ID found, preparing to move to transaction:', booking.id);
          console.log('Current booking data:', booking);

          // Tambahkan data tambahan untuk transaksi
          const additionalData = {
            protection: protection,
            protectionFee: protection ? hargaProteksi : 0,
            discount: discount,
            voucherId: booking.voucherId,
            voucherCode: booking.voucherCode,
            voucherTitle: booking.voucherTitle,
            totalPrice: hargaTotal,
            paymentDate: new Date().toISOString(),
            // Tambahkan data pengguna
            user: {
              name: "Pengguna",
              email: "user@example.com",
              phone: "08123456789"
            }
          };

          console.log('Additional data for transaction:', additionalData);

          // Verifikasi booking history sebelum pemindahan
          const bookingHistoryBefore = getBookingHistory();
          console.log('Booking history before moving:', bookingHistoryBefore);

          // Pindahkan booking ke transaksi
          console.log('Attempting to move booking to transaction:', booking.id);
          const result = moveBookingToTransaction(booking.id, "Berhasil", additionalData);
          console.log('Move booking result:', result);

          // Verifikasi booking history dan transaksi setelah pemindahan
          const bookingHistoryAfter = getBookingHistory();
          console.log('Booking history after moving:', bookingHistoryAfter);

          const transactions = getTransactions();
          console.log('Transactions after moving:', transactions);

          // Verifikasi apakah transaksi berhasil ditambahkan
          const transactionExists = transactions.some(t => t.id === booking.id);
          console.log('Transaction exists in transactions list:', transactionExists);
        } catch (error) {
          console.error('Error during moving booking to transaction:', error);
        }
      } else {
        console.error('No booking ID found, cannot move to transaction');
      }

      // Tutup modal PIN
      setShowPinModal(false);
      setIsProcessing(false);

      // Navigasi ke halaman pembayaran berhasil
      navigate("/pembayaran-sukses");
    } catch (error) {
      console.error("Error processing payment:", error);
      setIsProcessing(false);
      setPinError("Terjadi kesalahan saat memproses pembayaran.");
    }
  };

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
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 pt-4 pb-3 text-base font-bold border-b border-gray-100">
            Rincian Pembayaran
          </div>

          {/* Detail Booking */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="font-semibold text-sm">{booking.arenaName}</div>
            <div className="text-xs text-gray-600 mt-1">
              {booking.formattedDate || booking.date} | {booking.timeSlots ? `${booking.timeSlots[0]} - ${booking.timeSlots[booking.timeSlots.length - 1]}` : booking.time}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {booking.courtName || "Lapangan 1"}
            </div>
          </div>

          {/* Proteksi/Asuransi */}
          <label className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 bg-blue-50">
            <input
              type="checkbox"
              checked={protection}
              onChange={() => setProtection(!protection)}
              className="w-5 h-5 mt-0.5 accent-blue-600"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Proteksi Batal Booking</span>
                <span className="font-medium text-sm text-blue-600">Rp {hargaProteksi.toLocaleString()}</span>
              </div>
              <span className="text-xs text-gray-600 mt-0.5">Kompensasi hingga 100% jika batal booking!</span>
            </div>
          </label>

          {/* Rincian Harga */}
          <div className="px-4 py-3 space-y-2.5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Harga Lapangan</span>
              <span className="text-sm font-medium">Rp {price.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Biaya Layanan</span>
              <span className="text-sm text-gray-700">Rp {serviceFee.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Voucher
                </span>
                <span className="text-sm font-medium text-green-600">-Rp {discount.toLocaleString()}</span>
              </div>
            )}
            {protection && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Proteksi Batal Booking</span>
                <span className="text-sm text-gray-700">Rp {hargaProteksi.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Total Harga */}
          <div className="flex items-center justify-between px-4 py-4">
            <span className="font-bold text-gray-800">Total Harga</span>
            <span className="font-bold text-lg text-blue-600">Rp {hargaTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* S&K */}
        <div className="mt-3 text-xs text-gray-600 px-1">
          Dengan membeli, kamu setuju dengan <a href="#" className="text-blue-600 underline font-medium">Syarat & Ketentuan</a> kami.
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed left-0 right-0 bottom-0 z-30 px-4 py-3 bg-white shadow-xl border-t border-gray-200">
        <button
          onClick={handlePayButtonClick}
          className="w-full bg-blue-600 text-white font-bold text-base py-3 rounded-xl shadow-md active:bg-blue-700 transition"
        >
          Bayar Rp {hargaTotal.toLocaleString()}
        </button>
      </div>

      {/* PIN Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSubmit={handlePinSubmit}
        isNewPin={isPinNew}
        error={pinError}
        isProcessing={isProcessing}
      />
    </div>
  );
}
