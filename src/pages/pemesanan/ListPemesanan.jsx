// src/pages/pemesanan/Pemesanan.jsx

import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import BottomNavbar from "../main_menu/BottomNavbar";

const mockBookings = [
  {
    id: "INV-250406-ELSJXUC52-46",
    activity: "Badminton",
    venueTitle: "ZUPER KEPUTIH",
    venueSubtitle: "ZUPER KEPUTIH, SURABAYA",
    date: "Minggu, 06 April 2025",
    time: "20:00 - 23:00",
    status: "Menunggu",
  },
  {
    id: "INV-250407-ESDFWUC52-26",
    activity: "Badminton",
    venueTitle: "ZUPER DHARMAHUSADA",
    venueSubtitle: "ZUPER DHARMAHUSADA, SURABAYA",
    date: "Senin, 07 April 2025",
    time: "19:00 - 20:00",
    status: "Menunggu",
  },
  {
    id: "INV-250408-ELSOPSC52-40",
    activity: "Basket",
    venueTitle: "BABATAN",
    venueSubtitle: "BASKET BABATAN, SURABAYA",
    date: "Selasa, 08 April 2025",
    time: "17:00 - 21:00",
    status: "Menunggu",
  },
  {
    id: "INV-250406-FGHTUOC52-10",
    activity: "Billiard",
    venueTitle: "MERR",
    venueSubtitle: "JJ POOL BILLIARD MERR, SURABAYA",
    date: "Minggu, 06 April 2025",
    time: "21:00 - 24:00",
    status: "Menunggu",
  },
];

export default function Pemesanan() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 font-jakarta">
      {/* Header fixed */}
      <div className="fixed top-0 left-0 right-0 bg-[#F9FAFB] z-20">
        <div className="max-w-[434px] mx-auto px-4 pt-6 pb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600"
            >
              <IoArrowBack size={24} />
            </button>
            <h1 className="flex-1 text-center text-xl font-bold">
              Riwayat Pemesanan
            </h1>
            <div className="w-6" />
          </div>
        </div>
        <div className="border-b border-gray-200" />
      </div>

      {/* Konten */}
      <div className="pt-24 max-w-[434px] mx-auto px-4 space-y-4">
        {mockBookings.map((bk) => (
          <div
            key={bk.id}
            onClick={() => navigate(`/payment-detail/${bk.id}`)}
            className="bg-white rounded-2xl shadow px-4 py-4 flex justify-between items-start"
          >
            {/* Detail */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500">
                <span className="font-semibold">ID Transaksi:</span> {bk.id}
              </div>
              <div className="text-sm font-semibold uppercase">
                {bk.activity} – {bk.venueTitle}
              </div>
              <div className="text-xs text-gray-600">{bk.activity}</div>
              <div className="text-xs text-gray-600">{bk.venueSubtitle}</div>
              <div className="text-xs text-gray-600">{bk.date}</div>
              <div className="text-xs text-gray-600">{bk.time}</div>
            </div>
            {/* Status */}
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800"
            >
              {bk.status}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}
