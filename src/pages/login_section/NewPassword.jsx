import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

function NewPassword() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9FAFB] px-4 py-6">
      <div className="w-full max-w-[434px] min-h-[917px] bg-white rounded-3xl shadow-md p-6 font-jakarta">

        {/* Tombol Kembali */}
        <button
          className="text-sporta-blue text-sm mb-4 flex items-center gap-2"
          onClick={() => navigate("/verification")}
        >
          <IoArrowBack size={20} />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Judul */}
        <h2 className="text-xl font-bold text-black mb-1">Buat Kata Sandi Baru</h2>
        <p className="text-sm text-gray-500 mb-6">
          Buat kata sandi baru. Pastikan berbeda dari yang sebelumnya demi keamanan.
        </p>

        {/* Form Input */}
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kata Sandi Baru</label>
            <input
              type="password"
              placeholder="Masukkan Kata Sandi Baru"
              className="w-full px-4 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Konfirmasi Kata Sandi baru</label>
            <input
              type="password"
              placeholder="Masukkan kembali kata sandi baru"
              className="w-full px-4 py-2 border rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              navigate("/done");
            }}
            className="w-full py-3 bg-sporta-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Perbaharui Kata Sandi
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
