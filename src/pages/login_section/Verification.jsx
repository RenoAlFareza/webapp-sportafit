import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

function Verification() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9FAFB] px-4 py-6">
      <div className="w-full max-w-[434px] min-h-[917px] bg-white rounded-3xl shadow-md p-6 font-jakarta">

        {/* Tombol Kembali */}
        <button
          className="text-sporta-blue text-sm mb-4 flex items-center gap-2"
          onClick={() => navigate("/forgot-password")}
        >
          <IoArrowBack size={20} />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Judul */}
        <h2 className="text-xl font-bold text-black mb-1">Periksa Kotak Email</h2>
        <p className="text-sm text-gray-500 mb-6">
          Kami telah mengirimkan tautan untuk atur ulang kata sandi ke e-mail
          <span className="font-medium text-black"> desisngg...@gmail.com</span>. Masukkan 5 digit kode yang dikirim ke dalam email!
        </p>

        {/* Input Kode */}
        <div className="flex justify-between gap-2 mb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="w-full text-center border rounded-lg py-2 text-lg"
            />
          ))}
        </div>

        {/* Tombol Verifikasi */}
        <button
          onClick={() => navigate("/new-password")}
          className="w-full py-3 bg-sporta-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Verifikasi
        </button>

        {/* Kirim ulang */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Belum menerima pesan Email?
          <button className="text-sporta-blue font-bold ml-1 hover:underline">
            Kirim Ulang Pesan Email
          </button>
        </p>
      </div>
    </div>
  );
}

export default Verification;
