import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocation } from "../../context/LocationContext"; // ✅

const locations = [
  "Ambon", "Bali", "Balikpapan", "Bandung", "Banjarbaru", "Banjarmasin",
  "Batam", "Baubau", "Bekasi", "Bengkulu", "Binjai", "Blitar",
  "Bogor", "Bondowoso", "Cianjur", "Cikarang",
];

function LocationSelector() {
  const navigate = useNavigate();
  const { setLocation } = useLocation(); // ✅

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-[917px] w-full max-w-[434px] mx-auto bg-[#F9FAFB] flex flex-col font-jakarta"
    >
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-3 shadow rounded-b-xl">
        <button onClick={() => navigate(-1)}>
          <IoArrowBack size={22} />
        </button>
        <h1 className="text-sm font-medium">Pilih Lokasi</h1>
      </div>

      {/* List lokasi */}
      <div className="flex-1 overflow-y-auto">
        {locations.map((city, i) => (
          <div
            key={i}
            className="border-b px-5 py-3 text-sm hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setLocation(city.toUpperCase()); // ✅ set dan navigate
              navigate("/home");
            }}
          >
            {city.toUpperCase()}
          </div>
        ))}

        {/* Tombol Lokasi */}
        <div className="sticky bottom-0 bg-gradient-to-t from-[#F9FAFB] to-transparent pt-5 pb-8 flex justify-center">
          <button
            className="bg-sporta-blue text-white px-6 py-3 rounded-xl text-sm font-semibold"
            onClick={() => {
              setLocation("LOKASI SAYA"); // nanti bisa pakai navigator.geolocation
              navigate("/home");
            }}
          >
            Gunakan Lokasi Saya
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default LocationSelector;
