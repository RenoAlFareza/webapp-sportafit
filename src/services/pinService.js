// src/services/pinService.js

// Kunci untuk menyimpan PIN di localStorage
const PIN_KEY = 'user_pin';

// Fungsi untuk memeriksa apakah pengguna sudah memiliki PIN
export const hasPin = () => {
  return localStorage.getItem(PIN_KEY) !== null;
};

// Fungsi untuk menyimpan PIN baru
export const savePin = (pin) => {
  // Dalam aplikasi produksi, PIN seharusnya di-hash
  // Tapi untuk tujuan pembelajaran, kita simpan langsung
  localStorage.setItem(PIN_KEY, pin);
  return true;
};

// Fungsi untuk memverifikasi PIN
export const verifyPin = (inputPin) => {
  const savedPin = localStorage.getItem(PIN_KEY);
  return savedPin === inputPin;
};

// Fungsi untuk menghapus PIN (untuk keperluan testing)
export const resetPin = () => {
  localStorage.removeItem(PIN_KEY);
  return true;
};

export default {
  hasPin,
  savePin,
  verifyPin,
  resetPin
};
