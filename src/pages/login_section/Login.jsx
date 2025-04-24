import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#F9FAFB] px-4 py-6">
      <div className="container max-w-sm w-full bg-white rounded-3xl shadow-md overflow-hidden flex flex-col">

        {/* Gambar Header */}
        <div className="w-full h-[200px] bg-[url('/login-hero.png')] bg-cover bg-center sm:bg-right rounded-t-3xl" />

        {/* Konten Login */}
        <div className="flex flex-col px-6 py-6 sm:p-8 flex-grow">
          <h2 className="text-[26px] sm:text-[28px] font-bold text-sporta-blue text-center mb-6 font-jakarta">
            Selamat Datang!
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Masukkan Email"
                className="w-full px-4 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kata Sandi</label>
              <input
                type="password"
                placeholder="Masukkan Kata Sandi"
                className="w-full px-4 py-2 border rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2 sm:gap-0">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Ingat Saya
              </label>
              <a
                href="/forgot-password"
                className="text-[13px] font-bold text-sporta-blue hover:underline font-jakarta"
              >
                Lupa Kata Sandi?
              </a>
            </div>

            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                navigate("/home"); // arahkan ke halaman Home
              }}
              className="w-full py-2 bg-sporta-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Masuk
            </button>

          </form>

          {/* Social Login */}
          <div className="mt-8 text-center text-sm text-gray-500">Atau masuk dengan</div>
          <div className="flex justify-center gap-4 mt-5 mb-4">
            <img src="/fb.png" alt="Facebook" className="w-6 h-6" />
            <img src="/google.png" alt="Google" className="w-6 h-6" />
            <img src="/apple.png" alt="Apple" className="w-6 h-6" />
            <img src="/x.png" alt="X" className="w-6 h-6" />
          </div>

          {/* Footer */}
          <div className="text-center text-sm mt-5">
            Belum punya Akun?{" "}
            <a
              href="/register"
              className="text-[13px] font-jakarta text-sporta-blue font-bold hover:underline"
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
