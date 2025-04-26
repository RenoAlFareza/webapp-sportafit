// src/pages/pemesanan/InvoiceFailed.jsx

import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import logo from "/Logo.png"; // sesuaikan path
import { getBookingById } from "../../services/bookingHistoryService";

export default function InvoiceFailed() {
  const navigate = useNavigate();
  const { id } = useParams();
  const invoiceRef = useRef();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);

  // Fallback/mock data jika transaksi tidak ditemukan
  const fallbackInvoice = {
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

  // Ambil data transaksi berdasarkan ID
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        console.log('Fetching failed transaction for invoice with ID:', id);

        // Ambil data transaksi dari localStorage
        const data = getBookingById(id);
        console.log('Failed transaction data for invoice:', data);

        if (data) {
          setTransaction(data);
        } else {
          console.log('Failed transaction not found, using fallback data');
        }
      } catch (error) {
        console.error('Error fetching failed transaction for invoice:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  // Konversi data transaksi ke format invoice
  const getInvoiceData = () => {
    if (!transaction) return fallbackInvoice;

    // Format tanggal transaksi
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };

    // Format tanggal untuk item
    const formatDateForItem = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    // Hitung harga per jam dan total jam
    let totalHours;

    // Jika ada timeSlots, gunakan panjang array sebagai jumlah jam (bukan length-1)
    if (transaction.timeSlots && transaction.timeSlots.length > 0) {
      totalHours = transaction.timeSlots.length;
    } else {
      // Jika tidak ada timeSlots, coba ekstrak dari properti time (format: "08:00 - 10:00")
      if (transaction.time && transaction.time.includes(" - ")) {
        const [startTime, endTime] = transaction.time.split(" - ");
        const startHour = parseInt(startTime.split(":")[0]);
        const endHour = parseInt(endTime.split(":")[0]);
        totalHours = endHour - startHour;
      } else {
        totalHours = 1; // Default jika tidak bisa menentukan
      }
    }

    // Hitung harga per jam
    const pricePerHour = transaction.pricePerHour || (transaction.totalPrice / totalHours);

    console.log('Failed transaction data:', {
      totalPrice: transaction.totalPrice,
      timeSlots: transaction.timeSlots,
      time: transaction.time,
      totalHours,
      pricePerHour,
      payment: transaction.payment
    });

    // Buat array items berdasarkan timeSlots atau time
    const items = [];

    // Jika ada timeSlots, buat item untuk setiap jam
    if (transaction.timeSlots && transaction.timeSlots.length > 0) {
      // Untuk setiap slot waktu yang dipilih, buat item invoice
      for (let i = 0; i < transaction.timeSlots.length; i++) {
        const startTime = transaction.timeSlots[i];
        // Hitung endTime (1 jam setelah startTime)
        const startHour = parseInt(startTime.split(":")[0]);
        const endHour = startHour + 1;
        const endTime = `${String(endHour).padStart(2, '0')}:00`;

        items.push({
          activity: transaction.activity || "Badminton",
          product: transaction.courtName || "Lapangan",
          date: formatDateForItem(transaction.date) || transaction.formattedDate?.split(', ')[1] || "Tanggal tidak tersedia",
          time: `${startTime} - ${endTime}`,
          price: pricePerHour,
        });
      }

      console.log(`Created ${items.length} items for failed invoice from timeSlots`);
    }
    // Jika tidak ada timeSlots tapi ada time, coba ekstrak dari time
    else if (transaction.time && transaction.time.includes(" - ")) {
      const [startTimeStr, endTimeStr] = transaction.time.split(" - ");
      const startHour = parseInt(startTimeStr.split(":")[0]);
      const endHour = parseInt(endTimeStr.split(":")[0]);

      // Buat item untuk setiap jam
      for (let hour = startHour; hour < endHour; hour++) {
        const startTime = `${String(hour).padStart(2, '0')}:00`;
        const endTime = `${String(hour + 1).padStart(2, '0')}:00`;

        items.push({
          activity: transaction.activity || "Badminton",
          product: transaction.courtName || "Lapangan",
          date: formatDateForItem(transaction.date) || transaction.formattedDate?.split(', ')[1] || "Tanggal tidak tersedia",
          time: `${startTime} - ${endTime}`,
          price: pricePerHour,
        });
      }

      console.log(`Created ${items.length} items for failed invoice from time string`);
    }
    // Fallback: Jika tidak bisa menentukan, buat 1 item
    else {
      items.push({
        activity: transaction.activity || "Badminton",
        product: transaction.courtName || "Lapangan",
        date: formatDateForItem(transaction.date) || transaction.formattedDate?.split(', ')[1] || "Tanggal tidak tersedia",
        time: transaction.time || "Waktu tidak tersedia",
        price: pricePerHour,
      });

      console.log('Created 1 fallback item for failed invoice');
    }

    console.log('Failed invoice items:', items);

    return {
      id: transaction.id,
      transactionDate: formatDate(transaction.completedAt || transaction.createdAt),
      dueDate: formatDate(transaction.expiryTime),
      orderStatus: "Gagal", // Selalu gagal untuk InvoiceFailed
      paymentStatus: "Gagal", // Selalu gagal untuk InvoiceFailed
      customer: {
        name: transaction.user?.name || "Pengguna",
        phone: transaction.user?.phone || "Tidak tersedia",
      },
      venue: {
        name: transaction.arenaName || transaction.venueTitle,
        address: transaction.venueSubtitle || "Alamat tidak tersedia",
        phone: "Tidak tersedia", // Biasanya tidak ada di data transaksi
      },
      items: items,
      fee: transaction.serviceFee || 5000,
      promo: transaction.discount || 0,
      voucherInfo: transaction.voucherTitle ? {
        title: transaction.voucherTitle,
        code: transaction.voucherCode
      } : null,
    };
  };

  // Dapatkan data invoice
  const invoice = getInvoiceData();

  // Hitung subtotal dari semua item
  const subTotal = invoice.items.reduce((sum, it) => sum + it.price, 0);
  // Hitung total pembayaran
  const total = subTotal + invoice.fee - invoice.promo;

  console.log('Failed invoice calculations:', {
    items: invoice.items,
    subTotal,
    fee: invoice.fee,
    promo: invoice.promo,
    total
  });

  // Selalu false karena ini versi gagal
  const handlePrint = () => window.print();

  // Tampilkan loading jika data masih diambil
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-jakarta px-4 pt-6 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
            <span className="flex items-center gap-1">
              {invoice.voucherInfo ? 'Voucher' : 'Promo'}
              {invoice.voucherInfo && (
                <span className="text-xs text-gray-500">({invoice.voucherInfo.title})</span>
              )}
            </span>
            <span className="text-green-600">- Rp{invoice.promo.toLocaleString()}</span>
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
