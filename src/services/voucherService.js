// src/services/voucherService.js

import { API_BASE_URL } from "../config/api";
import { getAuthToken } from "./authService";

/**
 * Service untuk mengelola voucher
 */
export default class VoucherService {
  /**
   * Mengambil semua voucher yang tersedia
   * @returns {Promise<Object>} Response dari API
   */
  static async getAllVouchers() {
    try {
      // Untuk demo, kita akan mengembalikan data dummy
      // Dalam implementasi nyata, ini akan memanggil API
      return {
        success: true,
        message: "Vouchers retrieved successfully",
        data: [
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
        ]
      };

      // Implementasi dengan API
      /*
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/vouchers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      const data = await response.json();
      return data;
      */
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch vouchers",
        data: null
      };
    }
  }

  /**
   * Mengambil voucher berdasarkan ID
   * @param {number|string} id ID voucher
   * @returns {Promise<Object>} Response dari API
   */
  static async getVoucherById(id) {
    try {
      // Untuk demo, kita akan mengembalikan data dummy
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

      const voucher = dummyVouchers.find(v => v.id === parseInt(id));
      
      if (!voucher) {
        return {
          success: false,
          message: "Voucher not found",
          data: null
        };
      }

      return {
        success: true,
        message: "Voucher retrieved successfully",
        data: voucher
      };

      // Implementasi dengan API
      /*
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/vouchers/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      const data = await response.json();
      return data;
      */
    } catch (error) {
      console.error(`Error fetching voucher with ID ${id}:`, error);
      return {
        success: false,
        message: error.message || "Failed to fetch voucher",
        data: null
      };
    }
  }

  /**
   * Mengambil voucher yang dimiliki user
   * @returns {Promise<Object>} Response dari API
   */
  static async getUserVouchers() {
    try {
      // Untuk demo, kita akan mengembalikan data dummy
      // Dalam implementasi nyata, ini akan memanggil API
      return {
        success: true,
        message: "User vouchers retrieved successfully",
        data: [
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
            isUsed: true,
            usedAt: "2023-12-15T08:30:00.000Z"
          }
        ]
      };

      // Implementasi dengan API
      /*
      const token = getAuthToken();
      if (!token) {
        return {
          success: false,
          message: "User not authenticated",
          data: null
        };
      }

      const response = await fetch(`${API_BASE_URL}/user/vouchers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
      */
    } catch (error) {
      console.error("Error fetching user vouchers:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch user vouchers",
        data: null
      };
    }
  }

  /**
   * Menambahkan voucher ke user
   * @param {string} voucherCode Kode voucher
   * @returns {Promise<Object>} Response dari API
   */
  static async addVoucherToUser(voucherCode) {
    try {
      // Untuk demo, kita akan mengembalikan data dummy
      // Dalam implementasi nyata, ini akan memanggil API
      return {
        success: true,
        message: "Voucher added successfully",
        data: {
          id: 2,
          title: "Pakai QRIS BCA – Cashback Hingga 25%",
          validUntil: "30 Maret 2025",
          imageUrl: "/Voucher2.png",
          code: "QRISBCA25",
          description: "Gunakan metode pembayaran QRIS BCA dan dapatkan cashback hingga 25%",
          discountType: "percentage",
          discountValue: 25,
          minPurchase: 50000,
          maxDiscount: 50000,
          isUsed: false,
          usedAt: null
        }
      };

      // Implementasi dengan API
      /*
      const token = getAuthToken();
      if (!token) {
        return {
          success: false,
          message: "User not authenticated",
          data: null
        };
      }

      const response = await fetch(`${API_BASE_URL}/user/vouchers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code: voucherCode })
      });

      const data = await response.json();
      return data;
      */
    } catch (error) {
      console.error("Error adding voucher to user:", error);
      return {
        success: false,
        message: error.message || "Failed to add voucher",
        data: null
      };
    }
  }

  /**
   * Menggunakan voucher
   * @param {number|string} voucherId ID voucher
   * @returns {Promise<Object>} Response dari API
   */
  static async useVoucher(voucherId) {
    try {
      // Untuk demo, kita akan mengembalikan data dummy
      // Dalam implementasi nyata, ini akan memanggil API
      return {
        success: true,
        message: "Voucher used successfully",
        data: {
          id: parseInt(voucherId),
          isUsed: true,
          usedAt: new Date().toISOString()
        }
      };

      // Implementasi dengan API
      /*
      const token = getAuthToken();
      if (!token) {
        return {
          success: false,
          message: "User not authenticated",
          data: null
        };
      }

      const response = await fetch(`${API_BASE_URL}/user/vouchers/${voucherId}/use`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
      */
    } catch (error) {
      console.error("Error using voucher:", error);
      return {
        success: false,
        message: error.message || "Failed to use voucher",
        data: null
      };
    }
  }

  /**
   * Menghitung diskon dari voucher
   * @param {Object} voucher Objek voucher
   * @param {number} amount Jumlah yang akan didiskon
   * @returns {number} Jumlah diskon
   */
  static calculateDiscount(voucher, amount) {
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
  }
}
