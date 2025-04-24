// src/pages/UbahPin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoEyeOff, IoEye } from 'react-icons/io5';

export default function UbahPin() {
  const navigate = useNavigate();
  const [pinLama, setPinLama] = useState('');
  const [pinBaru, setPinBaru] = useState('');
  const [konfirmasiPin, setKonfirmasiPin] = useState('');
  const [showPinBaru, setShowPinBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: panggil API untuk mengubah PIN di sini
    navigate(-1); // kembali ke halaman sebelumnya
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
            <input
              type="password"
              value={pinLama}
              onChange={(e) => setPinLama(e.target.value)}
              placeholder="123***"
              className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-sporta-blue"
            />
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

          {/* Tombol Simpan */}
          <button
            type="submit"
            className="w-full bg-sporta-blue text-white py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors"
          >
            Simpan
          </button>
        </form>
      </div>
    </div>
  );
}
