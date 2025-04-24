import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiHeart, FiMapPin, FiStar } from "react-icons/fi";

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
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In integer et eget sollicitudin tellus ut congue velit. Duis porta risus imperdiet egestas tortor ipsum et. Blandit mollis velit fuscus lectus tortor aenean.",
  policies: [
    "Dimohon Tidak Membawa Makanan dan Minuman dari luar Arena",
    "Dilarang Merokok / Vape di Area Badminton",
    "Wajib Memakai Sepatu Olahraga Badminton & Baju Olahraga",
    "Dilarang Meludah Atau Membuang Ingus di Area Badminton",
    "Dilarang Membawa Binatang Peliharaan, Minuman Keras, & Barang Terlarang lainnya",
    "Wajib Menjaga Kebersihan Area Permainan Badminton",
    "Jaga Barang Anda, Kehilangan Bukan Tanggung Jawab Kami",
    "Buanglah Sampah Pada Tempatnya",
    "Dilarang Berjudi Dalam Bentuk Apapun",
    "Wajib Menjaga Keamanan, Kenyamanan, & Menjaga Toleransi Kepada Sesama",
    "Wajib Datang Tepat Waktu, Terlambat Akan Mengurangi Jam Main",
    "Pencurian & Pelanggaran Hukum Akan Ditindak Lanjuti Ke Yang Berwajib",
    "Jadwal yang telah ditransaksikan tidak dapat di-refund ataupun reschedule karena adanya kerjasama pihak ketiga",
    "Segala jenis turnamen, mabar, ataupun acara komunitas yang melibatkan lebih dari 20 orang per lapangan wajib ijin dahulu",
  ],
};

function DetailArena() {
  const navigate = useNavigate();
  const { id } = useParams(); // Mendapatkan ID arena dari URL

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 pt-6 pb-32">
      {/* Header with Back Button */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate("/arena ")} className="p-2 text-gray-600">
          <IoArrowBack size={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">Detail Lapangan</h1>
        <div className="w-6" />
      </div>

      {/* Hero Image */}
      <div className="relative h-[200px] w-full rounded-2xl overflow-hidden mb-6">
        <img
          src={mockArena.img}
          alt={mockArena.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Arena Name, Rating, Hours, and Location */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{mockArena.name}</h2>
        <div className="flex items-center text-sm text-gray-600">
          <div className="flex items-center text-yellow-500">
            <FiStar />
            <span className="ml-1 text-sm font-semibold">{mockArena.rating}</span>
            <span className="ml-2">({mockArena.reviews} ulasan)</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600 mt-2">
          <span className="mr-2">🕒</span>
          {mockArena.hours}
        </div>
        <div className="flex items-center text-sm text-gray-600 mt-2">
          <FiMapPin className="mr-2" />
          {mockArena.address}
        </div>
      </div>

      {/* Price and Membership */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          <span className="block font-semibold">{mockArena.price}</span>
          <span className="text-xs text-gray-500">
            3 Jam/Lap/Bulan (4x Pertemuan)
          </span>
        </div>
        <button className="bg-sporta-blue text-white py-2 px-4 rounded-lg">
          Daftar
        </button>
      </div>

      {/* Facilities */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Fasilitas</h3>
        <div className="flex gap-2 mt-2">
          {mockArena.facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-semibold py-1 px-3 rounded-full"
            >
              {facility}
            </div>
          ))}
        </div>
      </div>

      {/* Arena Policies */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Kebijakan Arena</h3>
        <div className="text-xs text-gray-600">
          {mockArena.policies.slice(0, 3).map((policy, index) => (
            <p key={index}>{policy}</p>
          ))}
          <button className="text-blue-500">Selengkapnya</button>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Deskripsi</h3>
        <p className="text-xs text-gray-600">{mockArena.description}</p>
      </div>

      {/* Bottom Fixed Bar */}
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
