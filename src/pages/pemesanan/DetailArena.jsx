import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiMapPin, FiStar } from "react-icons/fi";
import { useState } from "react";

const mockArena = {
  name: "Arena Victory Badminton",
  address: "Jl. Merdeka No.10, Surabaya",
  rating: 4.5,
  reviews: 123,
  hours: "08.00 - 22.00 WIB",
  img: "/foto_lapangan.png",
  price: "Rp450.000 /Jam",
  facilities: ["Shower", "Toilet", "Kantin", "Parkir"],
  description:
    "Lapangan badminton indoor berstandar nasional. Lantai kayu, pencahayaan optimal, dan ruang ganti yang bersih. Cocok untuk latihan, komunitas, atau turnamen di pusat kota Surabaya.",
  policies: [
    "Dimohon Tidak Membawa Makanan dan Minuman dari luar Arena",
    "Dilarang Merokok / Vape di Area Badminton",
    "Wajib Memakai Sepatu Olahraga Badminton & Baju Olahraga",
    "Dilarang Meludah Atau Membuang Ingus di Area Badminton",
    "Jaga Barang Anda, Kehilangan Bukan Tanggung Jawab Kami",
  ],
};

function DetailArena() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAllPolicy, setShowAllPolicy] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 pt-6 pb-32 font-jakarta">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate("/arena")} className="p-2 text-gray-600">
          <IoArrowBack size={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">Detail Lapangan</h1>
        <div className="w-6" />
      </div>

      {/* Hero Image */}
      <div className="relative h-[200px] w-full rounded-2xl overflow-hidden mb-6">
        <img src={mockArena.img} alt={mockArena.name} className="w-full h-full object-cover" />
      </div>

      {/* Section 1: Rating, Jam, Lokasi */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center text-base">
          <FiStar className="text-yellow-500 mr-1" />
          <span className="font-bold">{mockArena.rating}</span>
          <span className="ml-2 text-gray-500 text-sm">({mockArena.reviews} ulasan)</span>
        </div>
        <div className="flex items-center text-gray-700 text-sm">
          <span className="mr-2">🕒</span>
          {mockArena.hours}
        </div>
        <div className="flex items-center text-gray-700 text-sm">
          <FiMapPin className="mr-2" />
          {mockArena.address}
        </div>
      </div>
      <hr className="my-4 border-gray-200" />

      {/* Section 2: Deskripsi */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-900 mb-1">Deskripsi Lapangan</div>
        <p className="text-xs text-gray-700">{mockArena.description}</p>
      </div>
      <hr className="my-4 border-gray-200" />

      {/* Section 3: Fasilitas */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-900 mb-2">Fasilitas</div>
        <div className="flex flex-wrap gap-2">
          {mockArena.facilities.map((facility, i) => (
            <span key={i} className="bg-blue-100 text-blue-800 text-xs font-semibold py-1 px-3 rounded-full">
              {facility}
            </span>
          ))}
        </div>
      </div>
      <hr className="my-4 border-gray-200" />

      {/* Section 4: Kebijakan */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-900 mb-1">Kebijakan Arena</div>
        <ul className="text-xs text-gray-700 space-y-1 mb-2">
          {(showAllPolicy ? mockArena.policies : mockArena.policies.slice(0, 3)).map((p, i) => (
            <li key={i}>{i + 1}. {p}</li>
          ))}
        </ul>
        {!showAllPolicy && mockArena.policies.length > 3 && (
          <div className="flex justify-center mt-2">
            <button className="text-blue-600 text-xs font-semibold"
              onClick={() => setShowAllPolicy(true)}>
              Selengkapnya
            </button>
          </div>
        )}
      </div>
      <hr className="my-4 border-gray-200" />

      {/* Section 5: Gabung Member */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-gray-900 mb-1">Gabung Member</div>
        <p className="text-xs text-gray-700">
          Ingin bermain rutin di arena ini? Daftar jadi member club untuk dapat jadwal khusus dan promo menarik. Cek info di bagian admin arena.
        </p>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            <span className="block font-semibold">{mockArena.price}</span>
            <span className="text-xs text-gray-500">
              3 Jam/Lap/Bulan (4x Pertemuan)
            </span>
          </div>
          <button
            onClick={() => navigate(`/lapangan-booking/${id}`)}
            className="bg-sporta-blue text-white py-2 px-4 rounded-lg"
          >
            Lihat Jadwal
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailArena;
