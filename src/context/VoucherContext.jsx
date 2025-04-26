// src/context/VoucherContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { VoucherService } from "../services/apiService";
import { useAuth } from "./AuthContext";

// Buat context
export const VoucherContext = createContext();

// Custom hook untuk menggunakan VoucherContext
export const useVoucher = () => useContext(VoucherContext);

// Provider component
export function VoucherProvider({ children }) {
  const [vouchers, setVouchers] = useState([]);
  const [userVouchers, setUserVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Ambil semua voucher saat komponen dimuat
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fallback ke data dummy karena API mungkin belum siap
        const dummyVouchers = [
          {
            id: 1,
            title: "Voucher Cashback s/d Rp 20.000",
            validUntil: "17 Agustus 2025",
            imageUrl: "/Voucher1.png",
            code: "CASHBACK20",
            description: "Dapatkan cashback hingga Rp 20.000 untuk pemesanan lapangan apa saja",
            discountType: "percentage",
            discountValue: 10,
            minPurchase: 100000,
            maxDiscount: 20000
          },
          {
            id: 2,
            title: "Pakai QRIS BCA – Cashback Hingga 25%",
            validUntil: "30 Maret 2025",
            imageUrl: "/Voucher2.png",
            code: "QRISBCA25",
            description: "Gunakan metode pembayaran QRIS BCA dan dapatkan cashback hingga 25%",
            discountType: "percentage",
            discountValue: 25,
            minPurchase: 50000,
            maxDiscount: 50000
          },
          {
            id: 3,
            title: "Voucher Diskon 15% Booking Lapangan",
            validUntil: "31 Desember 2025",
            imageUrl: "/Voucher3.png",
            code: "DISKON15",
            description: "Diskon 15% untuk pemesanan lapangan apa saja",
            discountType: "percentage",
            discountValue: 15,
            minPurchase: 0,
            maxDiscount: 30000
          },
          {
            id: 4,
            title: "Gratis Sewa Raket Badminton",
            validUntil: "30 November 2025",
            imageUrl: "/Voucher4.png",
            code: "GRATISRAKET",
            description: "Dapatkan gratis sewa raket badminton untuk setiap pemesanan lapangan",
            discountType: "fixed",
            discountValue: 15000,
            minPurchase: 75000,
            maxDiscount: null
          }
        ];

        setVouchers(dummyVouchers);
      } catch (err) {
        console.error("Error fetching vouchers:", err);
        setError(err.message);

        // Fallback to empty array if everything fails
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  // Ambil voucher user saat user berubah
  useEffect(() => {
    const fetchUserVouchers = async () => {
      if (!user) {
        setUserVouchers([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fallback ke data dummy karena API mungkin belum siap
        // Anggap user memiliki 2 voucher dari 4 voucher yang ada
        const dummyUserVouchers = [
          {
            id: 1,
            title: "Voucher Cashback s/d Rp 20.000",
            validUntil: "17 Agustus 2025",
            imageUrl: "/Voucher1.png",
            code: "CASHBACK20",
            description: "Dapatkan cashback hingga Rp 20.000 untuk pemesanan lapangan apa saja",
            discountType: "percentage",
            discountValue: 10,
            minPurchase: 100000,
            maxDiscount: 20000,
            isUsed: false,
            usedAt: null
          },
          {
            id: 3,
            title: "Voucher Diskon 15% Booking Lapangan",
            validUntil: "31 Desember 2025",
            imageUrl: "/Voucher3.png",
            code: "DISKON15",
            description: "Diskon 15% untuk pemesanan lapangan apa saja",
            discountType: "percentage",
            discountValue: 15,
            minPurchase: 0,
            maxDiscount: 30000,
            isUsed: false,
            usedAt: null
          }
        ];

        setUserVouchers(dummyUserVouchers);
      } catch (err) {
        console.error("Error fetching user vouchers:", err);
        setError(err.message);

        // Fallback to empty array if everything fails
        setUserVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserVouchers();
  }, [user]);

  // Fungsi untuk mendapatkan voucher berdasarkan ID
  const getVoucherById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Cari di state dulu
      const existingVoucher = vouchers.find(v => v.id === parseInt(id));
      if (existingVoucher) {
        return existingVoucher;
      }

      // Fallback ke data dummy jika tidak ditemukan di state
      const dummyVoucher = {
        id: parseInt(id),
        title: `Voucher #${id}`,
        validUntil: "31 Desember 2025",
        imageUrl: "/Voucher1.png",
        code: `CODE${id}`,
        description: "Deskripsi voucher",
        discountType: "percentage",
        discountValue: 10,
        minPurchase: 100000,
        maxDiscount: 20000
      };

      return dummyVoucher;
    } catch (err) {
      console.error(`Error fetching voucher with ID ${id}:`, err);
      setError(err.message);

      // Return a basic voucher object if everything fails
      return {
        id: parseInt(id),
        title: "Voucher",
        validUntil: "31 Desember 2025",
        imageUrl: "/Voucher1.png",
        code: "CODE",
        description: "Deskripsi voucher",
        discountType: "percentage",
        discountValue: 10,
        minPurchase: 0,
        maxDiscount: 10000
      };
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menambahkan voucher ke user
  const addVoucherToUser = async (voucherCode) => {
    try {
      setLoading(true);
      setError(null);

      // Untuk demo, kita akan menambahkan voucher ke state
      const voucherToAdd = vouchers.find(v => v.code === voucherCode);

      if (!voucherToAdd) {
        throw new Error("Voucher tidak ditemukan");
      }

      // Cek apakah user sudah memiliki voucher ini
      const alreadyHasVoucher = userVouchers.some(v => v.id === voucherToAdd.id);

      if (alreadyHasVoucher) {
        throw new Error("Anda sudah memiliki voucher ini");
      }

      // Tambahkan voucher ke state
      const newUserVoucher = {
        ...voucherToAdd,
        isUsed: false,
        usedAt: null
      };

      setUserVouchers(prev => [...prev, newUserVoucher]);

      return {
        success: true,
        message: "Voucher berhasil ditambahkan",
        data: newUserVoucher
      };
    } catch (err) {
      console.error("Error adding voucher to user:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menggunakan voucher
  const useVoucher = async (voucherId) => {
    try {
      setLoading(true);
      setError(null);

      // Untuk demo, kita akan mengubah status voucher di state
      const voucherIndex = userVouchers.findIndex(v => v.id === parseInt(voucherId));

      if (voucherIndex === -1) {
        throw new Error("Voucher tidak ditemukan");
      }

      // Cek apakah voucher sudah digunakan
      if (userVouchers[voucherIndex].isUsed) {
        throw new Error("Voucher sudah digunakan");
      }

      // Update status voucher
      const updatedUserVouchers = [...userVouchers];
      updatedUserVouchers[voucherIndex] = {
        ...updatedUserVouchers[voucherIndex],
        isUsed: true,
        usedAt: new Date().toISOString()
      };

      setUserVouchers(updatedUserVouchers);

      return {
        success: true,
        message: "Voucher berhasil digunakan",
        data: updatedUserVouchers[voucherIndex]
      };
    } catch (err) {
      console.error("Error using voucher:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghitung diskon dari voucher
  const calculateDiscount = (voucher, amount) => {
    if (!voucher) return 0;

    // Cek minimum purchase
    if (amount < voucher.minPurchase) return 0;

    let discount = 0;

    if (voucher.discountType === "percentage") {
      // Hitung diskon persentase
      discount = (amount * voucher.discountValue) / 100;

      // Terapkan maksimum diskon jika ada
      if (voucher.maxDiscount !== null && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount;
      }
    } else if (voucher.discountType === "fixed") {
      // Diskon tetap
      discount = voucher.discountValue;
    }

    // Pastikan diskon tidak melebihi jumlah yang akan didiskon
    return Math.min(discount, amount);
  };

  // Nilai yang akan disediakan oleh context
  const value = {
    vouchers,
    userVouchers,
    loading,
    error,
    getVoucherById,
    addVoucherToUser,
    useVoucher,
    calculateDiscount
  };

  return (
    <VoucherContext.Provider value={value}>
      {children}
    </VoucherContext.Provider>
  );
}
