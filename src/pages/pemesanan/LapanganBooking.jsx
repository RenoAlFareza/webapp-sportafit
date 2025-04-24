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
    if (BOOKED_SLOTS.includes(t) || UNAVAILABLE_SLOTS.includes(t)) return;
    setSelectedTimes(prev =>
      prev.includes(t)
        ? prev.filter(x => x !== t)
        : [...prev, t]
    );
  };

  const totalPrice = selectedTimes.length * PRICE_PER_HOUR;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-jakarta">
      {/* Header Fixed */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md flex items-center h-16 px-4">
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

      <div className="pt-20 px-4 pb-32">
        {/* Native date picker */}
        {showNativePicker && (
          <input
            type="date"
            className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 bg-white rounded shadow p-2"
            onChange={e => {
              const d = new Date(e.target.value);
              if (!isNaN(d)) setSelectedDate(d);
              setShowNativePicker(false);
            }}
          />
        )}

        {/* Tanggal */}
        <h3 className="text-lg font-bold mb-2">Tanggal</h3>
        <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
          {dates.map(d => {
            const isSelected = d.toDateString() === selectedDate.toDateString();
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelectedDate(d)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium
                  shadow-sm border
                  ${isSelected
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-200"}
                `}
              >
                <div>{format(d, "d MMM")}</div>
                <div className="text-xs">{format(d, "EEE")}</div>
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 my-6" />

        {/* Pilih Lapangan */}
        <h3 className="text-lg font-bold mb-2">Lapangan</h3>
        <div className="flex gap-2 py-2">
          {["Lapangan 1", "Lapangan 2"].map(lap => (
            <button
              key={lap}
              onClick={() => setSelectedLapangan(lap)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium border
                ${selectedLapangan === lap
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-200"}
              `}
            >
              {lap}
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 my-6" />

        {/* Grid Jam */}
        <h3 className="text-lg font-bold mb-3">Jam</h3>
        <div className="grid grid-cols-4 gap-3">
          {times.map(t => {
            const booked = BOOKED_SLOTS.includes(t);
            const unavailable = UNAVAILABLE_SLOTS.includes(t);
            const selected = selectedTimes.includes(t);

            let baseClass;
            if (unavailable) {
              baseClass = "bg-gray-100 text-gray-300 cursor-not-allowed";
            } else if (booked) {
              baseClass = "bg-red-500 text-white font-bold shadow";
            } else if (selected) {
              baseClass = "bg-green-500 text-white font-bold shadow";
            } else {
              baseClass = "bg-gray-50 text-gray-700 hover:bg-blue-50";
            }

            return (
              <button
                key={t}
                onClick={() => onTimeClick(t)}
                disabled={unavailable || booked}
                className={`flex flex-col items-center justify-center px-2 py-3 rounded-xl text-sm h-[54px] border ${baseClass}`}
                style={{ boxShadow: unavailable ? "none" : "0 1px 6px rgba(30,64,175,0.06)" }}
              >
                <span className="font-semibold">{t}</span>
                {!booked && !unavailable && <span className="text-[10px]">80K</span>}
              </button>
            );
          })}
        </div>

        {/* Status Keterangan */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600 py-4 mt-3">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full inline-block" /> Tersedia
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 border border-green-600 rounded-full inline-block" /> Dipilih
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 border border-red-600 rounded-full inline-block" /> Sudah Dibooking
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 my-6" />

        {/* Total Harga */}
        <div className="flex items-center justify-between py-2 mb-4">
          <div className="text-sm">Total Harga</div>
          <div className="text-xl font-bold tracking-tight">
            Rp{totalPrice.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white shadow-xl py-4 px-4">
        <button
          onClick={() => navigate(`/payment-detail/${id}`)}
          className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold text-lg shadow-md active:bg-blue-600 transition"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}
