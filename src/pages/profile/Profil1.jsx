// src/pages/profile/Profil1.jsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoArrowBack, IoChevronForward, IoPersonOutline, IoTicketOutline, IoNotificationsOutline, IoPersonRemoveOutline, IoKeyOutline, IoShieldCheckmarkOutline, IoHelpCircleOutline, IoCallOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import UserService from "../../services/userService";

function Profil1() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Ambil data user dari backend jika belum ada di context
  useEffect(() => {
    const fetchUserData = async () => {
      // Jika sudah ada data user di context, gunakan itu
      if (user) {
        setUserData(user);
        return;
      }

      // Jika tidak ada data user di context, coba ambil dari backend
      try {
        setLoading(true);
        const response = await UserService.getProfile();
        setUserData(response.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);

        // Jika gagal mengambil data dari backend, coba ambil dari localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Fungsi untuk handle logout
  const handleLogout = () => {
    logout();
  };

  // Fungsi untuk menangani klik pada menu
  const handleMenuClick = (label) => {
    switch (label) {
      case "Edit Profil":
        navigate("/edit-profil");
        break;
      case "Voucher":
        navigate("/voucher");
        break;
      case "Voucher Saya":
        navigate("/my-voucher");
        break;
      case "Pemberitahuan":
        navigate("/pemberitahuan");
        break;
      case "Non‑aktifkan Akun":
        navigate("/nonaktif-akun");
        break;
      case "Ubah PIN":
        navigate("/ubah-pin");
        break;
      case "Kebijakan Privasi":
        navigate("/kebijakan-privasi");
        break;
      case "FAQ":
        navigate("/faq");
        break;
      case "Kontak Kami":
        // Implementasi kontak kami
        window.open("mailto:support@sportafit.com", "_blank");
        break;
      default:
        console.log(`Menu ${label} diklik`);
    }
  };

  // data menu
  const sections = [
    {
      title: "Akun",
      items: [
        { label: "Edit Profil", icon: <IoPersonOutline size={20} /> },
        { label: "Voucher", icon: <IoTicketOutline size={20} /> },
        { label: "Voucher Saya", icon: <IoTicketOutline size={20} /> },
        { label: "Pemberitahuan", icon: <IoNotificationsOutline size={20} /> },
        { label: "Non‑aktifkan Akun", icon: <IoPersonRemoveOutline size={20} /> },
      ],
    },
    {
      title: "Keamanan",
      items: [
        { label: "Ubah PIN", icon: <IoKeyOutline size={20} /> },
        { label: "Kebijakan Privasi", icon: <IoShieldCheckmarkOutline size={20} /> },
      ],
    },
    {
      title: "Tentang Kami",
      items: [
        { label: "FAQ", icon: <IoHelpCircleOutline size={20} /> },
        { label: "Kontak Kami", icon: <IoCallOutline size={20} /> },
      ],
    },
  ];

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#F9FAFB] px-4 py-6">
      <div className="container max-w-sm sm:max-w-md md:max-w-lg lg:max-w-[434px] w-full bg-white rounded-3xl shadow-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b">
          <button onClick={() => navigate(-1)} className="text-sporta-blue">
            <IoArrowBack size={24} />
          </button>
          <h2 className="flex-1 text-center text-xl font-bold font-jakarta text-black">Profil</h2>
          {/* placeholder untuk rata tengah */}
          <div style={{ width: 24 }} />
        </div>

        {/* Konten */}
        <div className="flex-1 overflow-y-auto font-jakarta">
          {/* Error Message */}
          {error && (
            <div className="px-6 py-3 mb-2 bg-red-50 text-red-700 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Info Pengguna */}
          <div className="flex items-center gap-4 px-6 py-6 border-b">
            <FaUserCircle size={64} className="text-gray-400" />
            <div className="flex-1">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : userData ? (
                <>
                  <div className="text-lg font-semibold text-black">{userData.name}</div>
                  <div className="text-sm text-black">{userData.email}</div>
                  <div className="text-sm text-black">{userData.phone || "Nomor telepon belum diatur"}</div>
                </>
              ) : (
                <>
                  <div className="text-lg font-semibold text-black">Pengguna</div>
                  <div className="text-sm text-black">Email tidak tersedia</div>
                  <div className="text-sm text-black">Nomor telepon tidak tersedia</div>
                </>
              )}
            </div>
          </div>

          {/* Sections */}
          <div className="px-6 py-6 space-y-6">
            {sections.map((section, sIdx) => (
              <div key={sIdx}>
                <div className="text-sm font-semibold text-black mb-3">
                  {section.title}
                </div>
                <div className="space-y-3">
                  {section.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleMenuClick(item.label)}
                      className="w-full flex items-center justify-between py-3 border-b border-gray-200"
                    >
                      <div className="flex items-center gap-4 text-black">
                        {item.icon}
                        <span className="text-base">{item.label}</span>
                      </div>
                      <IoChevronForward size={20} className="text-black" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Keluar */}
          <div className="px-6 mt-6 mb-8">
            <button
              onClick={handleLogout}
              className="w-full bg-sporta-blue text-white py-3 rounded-xl text-base font-semibold hover:bg-blue-700 transition-colors"
            >
              Keluar
            </button>
          </div>

          {/* Versi Aplikasi */}
          <div className="text-center text-sm text-black py-4">
            V1.1.10
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profil1;
