// src/pages/profile/Profil1.jsx

import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoChevronForward, IoPersonOutline, IoTicketOutline, IoNotificationsOutline, IoPersonRemoveOutline, IoKeyOutline, IoShieldCheckmarkOutline, IoHelpCircleOutline, IoCallOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

function Profil1() {
  const navigate = useNavigate();

  // data menu
  const sections = [
    {
      title: "Akun",
      items: [
        { label: "Edit Profil", icon: <IoPersonOutline size={20} /> },
        { label: "Voucher", icon: <IoTicketOutline size={20} /> },
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
          {/* Info Pengguna */}
          <div className="flex items-center gap-4 px-6 py-6 border-b">
            <FaUserCircle size={64} className="text-gray-400" />
            <div className="flex-1">
              <div className="text-lg font-semibold text-black">Fajar Nugros</div>
              <div className="text-sm text-black">designgraphic.fernando@gmail.com</div>
              <div className="text-sm text-black">0812-1130-7064</div>
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
                      onClick={() => {
                        if (item.label === "Edit Profil") {
                          navigate("/edit-profil");
                        } else if (item.label === "Voucher") {
                          navigate("/voucher");
                        } else if (item.label === "Pemberitahuan") {
                          navigate("/pemberitahuan");
                        } else if (item.label === "Non‑aktifkan Akun") {
                          navigate("/nonaktif-akun");
                        } else if (item.label === "Ubah PIN") {
                          navigate("/ubah-pin");
                        } else if (item.label === "Kebijakan Privasi") {
                          navigate("/kebijakan-privasi");
                        } else if (item.label === "FAQ") {
                          navigate("/faq");
                        }
                        // Navigasi lainnya akan ditambahkan nanti
                      }}
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
              onClick={() => {/* aksi logout */}}
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
