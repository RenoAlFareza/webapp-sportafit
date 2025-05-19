// src/pages/UbahPin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoEyeOff, IoEye } from 'react-icons/io5';
import { hasPin, updatePin, resetPin } from '../../services/pinService';

export default function UbahPin() {
  const navigate = useNavigate();
  const [pinLama, setPinLama] = useState('');
  const [pinBaru, setPinBaru] = useState('');
  const [konfirmasiPin, setKonfirmasiPin] = useState('');
  const [showPinLama, setShowPinLama] = useState(false);
  const [showPinBaru, setShowPinBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasPinSet, setHasPinSet] = useState(false);

  // Fungsi untuk reset PIN (untuk debugging)
  const handleResetPin = async () => {
    try {
      setLoading(true);
      const result = await resetPin();
      if (result) {
        alert('PIN berhasil direset. Anda akan diarahkan ke halaman profil.');
        navigate('/profile');
      } else {
        setError('Gagal mereset PIN');
      }
    } catch (error) {
      console.error('Error resetting PIN:', error);
      setError('Terjadi kesalahan saat mereset PIN');
    } finally {
      setLoading(false);
    }
  };

  // Cek apakah user sudah memiliki PIN
  useEffect(() => {
    const checkPin = async () => {
      try {
        const result = await hasPin();
        setHasPinSet(result);

        if (!result) {
          // Jika belum punya PIN, arahkan ke halaman lain
          navigate('/profile');
          alert('Anda belum memiliki PIN. Silakan buat PIN terlebih dahulu saat melakukan pembayaran.');
        }
      } catch (error) {
        console.error('Error checking PIN:', error);
      }
    };

    checkPin();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi input
    if (!pinLama || !pinBaru || !konfirmasiPin) {
      setError('Semua field harus diisi');
      return;
    }

    if (pinBaru.length !== 6 || !/^\d+$/.test(pinBaru)) {
      setError('PIN baru harus terdiri dari 6 digit angka');
      return;
    }

    if (pinBaru !== konfirmasiPin) {
      setError('PIN baru dan konfirmasi PIN tidak cocok');
      return;
    }

    setLoading(true);

    try {
      // Panggil API untuk mengubah PIN
      const result = await updatePin(pinLama, pinBaru);

      if (result) {
        alert('PIN berhasil diubah');
        navigate(-1); // kembali ke halaman sebelumnya
      } else {
        setError('PIN lama tidak valid');
      }
    } catch (error) {
      console.error('Error updating PIN:', error);
      setError('Terjadi kesalahan saat mengubah PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#F9FAFB] px-4 py-6">
      <div className="container max-w-sm sm:max-w-md md:max-w-lg lg:max-w-[434px] w-full bg-white rounded-3xl shadow-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <IoArrowBack size={22} />
          </button>
          <h1 className="flex-1 text-center font-jakarta font-bold text-lg">
            Ubah PIN
          </h1>
          <div className="w-6" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 font-jakarta space-y-6 flex-1">
          <p className="text-sm text-gray-700">Silahkan Ubah PIN Anda</p>

          {/* PIN Lama */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              PIN Lama
            </label>
            <div className="relative">
              <input
                type={showPinLama ? 'text' : 'password'}
                value={pinLama}
                onChange={(e) => setPinLama(e.target.value)}
                placeholder="123***"
                maxLength={6}
                className="w-full border-b border-gray-300 py-2 pr-8 text-sm focus:outline-none focus:border-sporta-blue"
              />
              <button
                type="button"
                onClick={() => setShowPinLama((v) => !v)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400"
              >
                {showPinLama ? <IoEye size={20} /> : <IoEyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* PIN Baru */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              PIN Baru
            </label>
            <div className="relative">
              <input
                type={showPinBaru ? 'text' : 'password'}
                value={pinBaru}
                onChange={(e) => setPinBaru(e.target.value)}
                placeholder="123***"
                maxLength={6}
                className="w-full border-b border-gray-300 py-2 pr-8 text-sm focus:outline-none focus:border-sporta-blue"
              />
              <button
                type="button"
                onClick={() => setShowPinBaru((v) => !v)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400"
              >
                {showPinBaru ? <IoEye size={20} /> : <IoEyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Konfirmasi PIN Baru */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Konfirmasi PIN Baru
            </label>
            <div className="relative">
              <input
                type={showKonfirmasi ? 'text' : 'password'}
                value={konfirmasiPin}
                onChange={(e) => setKonfirmasiPin(e.target.value)}
                placeholder="123***"
                maxLength={6}
                className="w-full border-b border-gray-300 py-2 pr-8 text-sm focus:outline-none focus:border-sporta-blue"
              />
              <button
                type="button"
                onClick={() => setShowKonfirmasi((v) => !v)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400"
              >
                {showKonfirmasi ? <IoEye size={20} /> : <IoEyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* Tombol Simpan */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-blue-400' : 'bg-sporta-blue'} text-white py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors`}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>

          {/* Tombol Reset PIN (untuk debugging) */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleResetPin}
              disabled={loading}
              className="w-full border border-red-500 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Reset PIN (Untuk Debugging)
            </button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Tombol ini hanya untuk keperluan testing. Akan menghapus PIN Anda.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
