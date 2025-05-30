import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    agree: false
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi sederhana
    if (!form.agree) {
      setError("Kamu harus menyetujui kebijakan data pribadi.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     form.name,
          phone:    form.phone,
          email:    form.email,
          password: form.password
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      // Jika sukses, redirect ke halaman login
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#F9FAFB] px-4 py-6">
      <div className="container max-w-sm w-full bg-white rounded-3xl shadow-md overflow-hidden flex flex-col">

        {/* Gambar Header */}
        <div className="w-full h-[200px]">
          <img
            src="/sign-up-hero.png"
            alt="Register Banner"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Konten Register */}
        <div className="flex flex-col px-6 py-6 sm:p-8 flex-grow">
          <h2 className="text-[26px] sm:text-[28px] font-bold text-sporta-blue text-center mb-6 font-jakarta">
            Gabung Sekarang!
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
              <input
                name="name"
                type="text"
                placeholder="Masukkan Nama Lengkap"
                className="w-full px-4 py-2 border rounded-lg text-sm"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">No. Telepon</label>
              <input
                name="phone"
                type="tel"
                placeholder="Masukkan No. Telepon"
                className="w-full px-4 py-2 border rounded-lg text-sm"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

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

            <div className="flex items-start gap-2 text-sm mt-1">
              <input
                name="agree"
                type="checkbox"
                className="mt-[6px]"
                checked={form.agree}
                onChange={handleChange}
              />
              <p>
                Saya Setuju pada Ketentuan Penggunaan{" "}
                <a
                  href="/personaldata"
                  className="text-sporta-blue font-bold hover:underline text-[13px]"
                >
                  Data Pribadi
                </a>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sporta-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Daftar
            </button>
          </form>

          {/* Social Register */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Atau masuk dengan
          </div>
          <div className="flex justify-center gap-4 mt-5 mb-4">
            <img src="/fb.png" alt="Facebook" className="w-6 h-6" />
            <img src="/google.png" alt="Google" className="w-6 h-6" />
            <img src="/x.png" alt="X" className="w-6 h-6" />
          </div>

          {/* Footer */}
          <div className="text-center text-sm mt-5">
            Sudah Punya Akun?{" "}
            <a
              href="/login"
              className="text-[13px] font-jakarta text-sporta-blue font-bold hover:underline"
            >
              Masuk Sekarang
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
