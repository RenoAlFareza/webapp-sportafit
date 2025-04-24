// src/pages/arena/Arena1.jsx

import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiHeart, FiMapPin, FiStar } from "react-icons/fi";

const mockArenas = [
  {
    id: 1,
    name: "Arena Victory Badminton",
    address: "Jl. Merdeka No.10, Surabaya",
    img: "/foto_lapangan.png",
    rating: 4.5,
    reviews: 123,
  },
  {
    id: 2,
    name: "Lapangan Bintang Sport",
    address: "Jl. Pahlawan No.22, Surabaya",
    img: "/foto_lapangan1.jpg",
    rating: 4.2,
    reviews: 87,
  },
];

function Arena() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 pt-6 pb-24">
      <div className="max-w-[434px] mx-auto space-y-5 font-jakarta">
        {/* Header */}
        <div className="flex items-center mb-4">
          <button onClick={() => navigate("/home")} className="p-2 text-gray-600">
            <IoArrowBack size={24} />
          </button>
          <h1 className="flex-1 text-center text-xl font-bold">
            Daftar Arena
          </h1>
          <div className="w-6" />
        </div>

        {/* Overlay Cards */}
        {mockArenas.map((arena) => (
          <div
            key={arena.id}
            className="relative h-[250px] rounded-2xl overflow-hidden mb-4 cursor-pointer"
            onClick={() => navigate(`/arena/${arena.id}`)}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${arena.img})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Text Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold drop-shadow-lg">
                  {arena.name}
                </h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Mencegah event klik menyebar ke parent
                    // Logika untuk menambahkan ke favorit bisa ditambahkan di sini
                  }}
                  className="bg-black/40 p-2 rounded-full"
                >
                  <FiHeart size={18} className="text-white" />
                </button>
              </div>
              <div className="flex items-center text-sm mt-1 drop-shadow-md">
                <FiMapPin className="mr-1" />
                {arena.address}
              </div>
              <div className="flex items-center text-sm mt-1 drop-shadow-md">
                <FiStar className="text-yellow-400 mr-1" />
                <span className="font-semibold">{arena.rating}</span>
                <span className="ml-2">({arena.reviews} ulasan)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Arena;
