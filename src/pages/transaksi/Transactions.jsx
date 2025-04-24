// src/pages/transaksi/Transactions.jsx

import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import BottomNavbar from "../main_menu/BottomNavbar";

const mockTransactions = [
  {
    id: "INV-250406-ELSJXUC52-46",
    date: "Minggu, 06 April 2025",
    time: "20:00",
    total: 185000,
    items: 1,
    venue: "BADMINTON ZUPER KEPUTIH, SURABAYA",
    status: "Berhasil",
  },
  {
    id: "INV-250407-EKKXJUC52-49",
    date: "Senin, 07 April 2025",
    time: "19:00",
    total: 75000,
    items: 1,
    venue: "BADMINTON ZUPER DHARMAHUSADA, SURABAYA",
    status: "Berhasil",
  },
  {
    id: "INV-250408-ELKIDWAC52-26",
    date: "Selasa, 08 April 2025",
    time: "17:00",
    total: 500000,
    items: 1,
    venue: "BASKET BABATAN, SURABAYA",
    status: "Gagal",
  },
  {
    id: "INV-250409-ESDRTJC52-76",
    date: "Minggu, 06 April 2025",
    time: "21:00",
    total: 305000,
    items: 1,
    venue: "JJ POOL BILLIARD MERR, SURABAYA",
    status: "Berhasil",
  },
];

export default function Transactions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 font-jakarta">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#F9FAFB] z-20">
        <div className="max-w-[434px] mx-auto px-4 pt-6 pb-4">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-2 text-gray-600">
              <IoArrowBack size={24} />
            </button>
            <h1 className="flex-1 text-center text-xl font-bold">Transaksi</h1>
            <div className="w-6" />
          </div>
        </div>
        <div className="border-b border-gray-200" />
      </div>

      {/* Scrollable Content */}
      <div className="pt-24 max-w-[434px] mx-auto px-4 space-y-4">
        {mockTransactions.map((tx) => {
          const success = tx.status === "Berhasil";
          return (
            <div
              key={tx.id}
              onClick={() => navigate(success ? `/transaksi/success/${tx.id}` : `/transaksi/failed/${tx.id}`)}
              className={`
                flex bg-white rounded-2xl shadow
                border-l-4
                ${success ? "border-green-500" : "border-red-500"}
                overflow-hidden cursor-pointer hover:bg-gray-50
              `}
            >
              {/* Info utama */}
              <div className="flex-1 px-4 py-3">
                {/* ID (italic) */}
                <div className="text-xs text-gray-500 italic mb-1">
                  {tx.id}
                </div>
                {/* Tanggal & jam */}
                <div className="text-sm font-semibold mb-3">
                  {tx.date}{" "}
                  <span className="font-normal">|</span> {tx.time}
                </div>
                {/* Definition list */}
                <dl className="text-sm text-gray-700 space-y-2">
                  <div className="flex">
                    <dt className="w-20 font-medium">Total</dt>
                    <dd className="flex-1 font-semibold">
                      Rp{tx.total.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-20 font-medium">Jumlah</dt>
                    <dd className="flex-1 font-semibold">
                      {tx.items} Pesanan
                    </dd>
                  </div>
                  <div>
                    <dt className="block font-medium">Tempat</dt>
                    <dd className="mt-0.5 font-semibold">{tx.venue}</dd>
                  </div>
                </dl>
              </div>

              {/* Status badge */}
              <div className="flex items-start px-3 pt-3">
                <span
                  className={`
                    text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap
                    ${success
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"}
                  `}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}
