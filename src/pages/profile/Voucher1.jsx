import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const vouchers = [
  {
    id: 1,
    title: "Voucher Cashback s/d Rp 20.000",
    validUntil: "17 Agustus, 2025",
    imageUrl: "/Voucher1.png"
  },
  {
    id: 2,
    title: "Pakai QRIS BCA – Cashback Hingga 25%",
    validUntil: "30 Maret, 2025",
    imageUrl: "/Voucher2.png"
  },
  {
    id: 3,
    title: "Voucher Diskon 15% Booking Lapangan",
    validUntil: "31 Desember, 2025",
    imageUrl: "/Voucher3.png"
  },
  {
    id: 4,
    title: "Gratis Sewa Raket Badminton",
    validUntil: "30 November, 2025",
    imageUrl: "/Voucher4.png"
  }
];

export default function VoucherPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-[#F9FAFB] flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-[434px] bg-white rounded-3xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-4 py-4 border-b bg-white">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <IoArrowBack size={22} />
          </button>
          <h2 className="flex-1 text-center text-lg font-bold">Voucher</h2>
          <div className="w-6" />
        </div>

        {/* Category Tabs - only Badminton */}
        <div className="flex px-4 py-3 overflow-x-auto bg-white space-x-2">
          <button className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-800">
            Badminton
          </button>
        </div>

        {/* Voucher Cards */}
        <div className="p-4 space-y-4">
          {vouchers.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-40 w-full">
                <img
                  src={v.imageUrl}
                  alt={v.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = v.id % 2 === 0
                      ? "https://via.placeholder.com/400x200/6366f1/ffffff?text=Cashback+25%"
                      : "https://via.placeholder.com/400x200/1e40af/ffffff?text=Voucher+Cashback";
                  }}
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-base font-semibold">{v.title}</h3>
                <p className="text-xs text-gray-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Berlaku hingga {v.validUntil}
                </p>
                <button
                  onClick={() => navigate(`/voucher/${v.id}`)}
                  className="mt-2 px-4 py-2 bg-sporta-blue text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Pakai
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
