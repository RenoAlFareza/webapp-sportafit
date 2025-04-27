import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");

  // Force clear localStorage when login page is accessed
  useEffect(() => {
    // Clear localStorage to ensure we start fresh
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // Redirect to home if user becomes authenticated
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi sederhana
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    try {
      // Simpan email di localStorage untuk digunakan oleh UserService
      localStorage.setItem("lastEmail", form.email);

      // Gunakan fungsi login dari AuthContext
      await login(form.email, form.password);

      // Redirect ke halaman home
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login gagal");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 py-6">
      <div className="container max-w-sm w-full bg-white rounded-3xl shadow-md overflow-hidden flex flex-col">

        {/* Gambar Header */}
        <div className="w-full h-[200px] bg-[url('/login-hero.png')] bg-cover bg-center sm:bg-right rounded-t-3xl" />

        {/* Konten Login */}
        <div className="flex flex-col px-6 py-6 sm:p-8 flex-grow">
          <h2 className="text-[26px] sm:text-[28px] font-bold text-sporta-blue text-center mb-6 font-jakarta">
            Selamat Datang!
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Masukkan Email"
                className="w-full px-4 py-2 border rounded-lg text-sm"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kata Sandi</label>
              <input
                name="password"
                type="password"
                placeholder="Masukkan Kata Sandi"
                className="w-full px-4 py-2 border rounded-lg text-sm"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2 sm:gap-0">
              <label className="flex items-center gap-2">
                <input
                  name="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange}
                />
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
              className="w-full py-2 bg-sporta-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Masuk
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Atau masuk dengan
          </div>
          <div className="flex justify-center gap-4 mt-5 mb-4">
            <a href="/api/auth/google" className="social-login-button">
              <img src="/google.png" alt="Google" className="w-6 h-6 cursor-pointer" />
            </a>
            <a href="/api/auth/facebook" className="social-login-button">
              <img src="/fb.png" alt="Facebook" className="w-6 h-6 cursor-pointer" />
            </a>
            <a href="/api/auth/twitter" className="social-login-button">
              <img src="/x.png" alt="X" className="w-6 h-6 cursor-pointer" />
            </a>
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
