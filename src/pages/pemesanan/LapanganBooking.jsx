// src/pages/pemesanan/LapanganBooking.jsx

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack, IoCalendarOutline } from "react-icons/io5";
import { format, addDays, startOfToday } from "date-fns";

const DAYS_AHEAD = 30;
const PRICE_PER_HOUR = 80000;

const generateDates = () => {
  const today = startOfToday();
  return Array.from({ length: DAYS_AHEAD }).map((_, i) =>
    addDays(today, i)
  );
};

const generateTimes = () =>
  Array.from({ length: 24 }).map((_, i) => {
    const hh = String(i + 1).padStart(2, "0");
    return `${hh}:00`;
  });

const BOOKED_SLOTS = ["10:00", "16:00", "17:00", "18:00", "23:00"];

// Jam yang tidak tersedia (01:00-07:00)
const UNAVAILABLE_SLOTS = ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00"];

export default function LapanganBooking() {
  const navigate = useNavigate();
  const { id } = useParams();

  const dates = generateDates();
  const times = generateTimes();

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [showNativePicker, setShowNativePicker] = useState(false);
  const [selectedLapangan, setSelectedLapangan] = useState("Lapangan 1");
  const [selectedTimes, setSelectedTimes] = useState([]);

  const toggleNative = () => setShowNativePicker(v => !v);

  const onTimeClick = t => {
    // Tidak bisa klik jika slot sudah dibooking atau tidak tersedia (01:00-07:00)
    if (BOOKED_SLOTS.includes(t) || UNAVAILABLE_SLOTS.includes(t)) return;
    setSelectedTimes(prev =>
      prev.includes(t)
        ? prev.filter(x => x !== t)
        : [...prev, t]
    );
  };

  const totalPrice = selectedTimes.length * PRICE_PER_HOUR;

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 pt-6 pb-32 font-jakarta">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(`/arena/${id}`)}
          className="p-2 text-gray-600"
        >
          <IoArrowBack size={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">
          Pilih Tanggal & Jam
        </h1>
        <button onClick={toggleNative} className="p-2 text-gray-600">
          <IoCalendarOutline size={24} />
        </button>
      </div>

      {/* Native date picker */}
      {showNativePicker && (
        <input
          type="date"
          className="absolute top-16 left-1/2 transform -translate-x-1/2"
          onChange={e => {
            const d = new Date(e.target.value);
            if (!isNaN(d)) setSelectedDate(d);
            setShowNativePicker(false);
          }}
        />
      )}

      {/* Tanggal */}
      <h3 className="text-lg font-semibold">Tanggal</h3>
      <div className="flex gap-2 overflow-x-scroll py-2">
        {dates.map(d => {
          const isSelected = d.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={d.toISOString()}
              onClick={() => setSelectedDate(d)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium
                ${isSelected
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"}
              `}
            >
              <div>{format(d, "d MMM")}</div>
              <div className="text-xs">{format(d, "EEE")}</div>
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="border-t border-gray-300 my-4" />

      {/* Pilih Lapangan */}
      <h3 className="text-lg font-semibold">Lapangan</h3>
      <div className="flex gap-2 py-2">
        {["Lapangan 1", "Lapangan 2"].map(lap => (
          <button
            key={lap}
            onClick={() => setSelectedLapangan(lap)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              ${selectedLapangan === lap
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"}
            `}
          >
            {lap}
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="border-t border-gray-300 my-4" />

      {/* Grid Jam */}
      <h3 className="text-lg font-semibold">Jam</h3>
      <div className="grid grid-cols-4 gap-x-2 gap-y-3 py-2">
        {times.map(t => {
          const booked = BOOKED_SLOTS.includes(t);
          const unavailable = UNAVAILABLE_SLOTS.includes(t);
          const selected = selectedTimes.includes(t);

          // Menentukan kelas CSS berdasarkan status
          let baseClass;
          if (unavailable) {
            baseClass = "bg-gray-100 text-gray-300 cursor-default flex justify-center"; // Warna lebih putih untuk jam yang tidak tersedia
          } else if (booked) {
            baseClass = "bg-red-500 text-white flex justify-center";
          } else if (selected) {
            baseClass = "bg-green-500 text-white flex justify-center";
          } else {
            baseClass = "bg-gray-200 text-gray-700 flex justify-center";
          }

          return (
            <button
              key={t}
              onClick={() => onTimeClick(t)}
              disabled={unavailable || booked}
              className={`${baseClass} flex-col items-center px-2 py-2 rounded-xl text-xs w-full h-[50px]`}
            >
              <span className="font-medium">{t}</span>
              {!booked && !unavailable && <span className="text-[10px]">80K</span>}
            </button>
          );
        })}
      </div>

      {/* Keterangan Status */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 py-2">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-200 rounded-full" /> Tersedia
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded-full" /> Dipilih
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500 rounded-full" /> Sudah Dibooking
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-300 my-4" />

      {/* Total Harga */}
      <div className="py-2">
        <div className="text-sm">Total Harga</div>
        <div className="text-xl font-semibold">
          Rp{totalPrice.toLocaleString()}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl py-3 px-4">
        <button
          onClick={() => navigate(`/payment-detail/${id}`)}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}
