import { useNavigate, useParams } from "react-router-dom";
import {
  IoArrowBack,
  IoDocumentTextOutline,
  IoHelpCircleOutline,
  IoInformationCircleOutline,
  IoChevronForward,
} from "react-icons/io5";

export default function VoucherDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Contoh data—di real app nanti ambil dari API atau context/store berdasarkan `id`
  const voucher = {
    title: "Voucher Cashback s/d Rp 20.000",
    category: "Badminton",
    expiryLabel: "Berlaku Hingga",
    expiryDate: "17 Agustus 2025",
    imageUrl: "/Voucher1.png", // ganti path sesuai asset kamu
    sections: [
      {
        icon: <IoDocumentTextOutline size={20} className="text-sporta-blue" />,
        title: "Syarat dan Ketentuan",
        content: [
          "Voucher hanya berlaku untuk pemesanan lapangan badminton.",
          "Voucher dapat digunakan hingga tanggal yang tertera pada voucher ini, atau selama voucher masih tersedia.",
        ],
        hasChevron: true,
      },
      {
        icon: <IoHelpCircleOutline size={20} className="text-sporta-blue" />,
        title: "Bagaimana Cara Memakai Voucher ini?",
        content: [
          "Pastikan aplikasi Sporta Fit Anda sudah diperbarui ke versi terbaru.",
        ],
        hasChevron: true,
      },
      {
        icon: <IoInformationCircleOutline size={20} className="text-sporta-orange" />,
        title: "Tentang Voucher ini",
        content: ["Rp 12.000 di Pembelian Pertama Kamu!"],
        hasChevron: true,
      },
    ],
  };

  return (
    <div className="min-h-[100dvh] bg-[#F9FAFB] flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-[434px] bg-white rounded-3xl overflow-hidden shadow-md">
        {/* Header */}
        <div className="flex items-center px-4 h-14 border-b bg-white">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <IoArrowBack size={22} />
          </button>
          <h1 className="flex-1 text-center font-jakarta font-bold text-lg">
            Voucher
          </h1>
          <div className="w-6" />
        </div>

        {/* Hero Image */}
        <div className="relative">
          <img
            src={voucher.imageUrl}
            alt={voucher.title}
            className="w-full h-[160px] object-cover"
          />
          {/* dekorasi bulatan biru */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-5 bg-sporta-blue rounded-b-full" />
        </div>

        {/* Judul & Kategori */}
        <div className="px-6 pt-4">
          <h2 className="font-jakarta font-semibold text-base">
            {voucher.title}
          </h2>
          <p className="mt-1 text-sm text-gray-600">{voucher.category}</p>
        </div>

        {/* Expiry */}
        <div className="px-6 mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">{voucher.expiryLabel}</span>
          <span className="text-xs font-medium">{voucher.expiryDate}</span>
        </div>

        {/* Section List */}
        <div className="mt-4 divide-y">
          {voucher.sections.map((sec, i) => (
            <div
              key={i}
              className="px-6 py-4 flex items-start justify-between hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                if (sec.title === "Syarat dan Ketentuan") {
                  navigate("/voucher-sk");
                } else if (sec.title === "Bagaimana Cara Memakai Voucher ini?") {
                  navigate("/voucher-cp");
                } else if (sec.title === "Tentang Voucher ini") {
                  navigate("/voucher-info");
                }
              }}
            >
              <div className="flex items-start">
                <div className="mt-1">{sec.icon}</div>
                <div className="ml-3">
                  <p className="font-jakarta font-medium text-sm">
                    {sec.title}
                  </p>
                  {sec.content.map((line, idx) => (
                    <p
                      key={idx}
                      className="mt-1 text-xs text-gray-600 leading-tight"
                    >
                      {idx + 1}. {line}
                    </p>
                  ))}
                </div>
              </div>
              {sec.hasChevron && (
                <IoChevronForward
                  size={20}
                  className="text-gray-400 mt-1"
                />
              )}
            </div>
          ))}
        </div>

        {/* Tombol Pakai Sekarang */}
        <div className="px-6 pb-6 pt-4">
          <button
            onClick={() => {
              /* panggil API redeem atau navigate ke checkout */
            }}
            className="w-full bg-sporta-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Pakai Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
