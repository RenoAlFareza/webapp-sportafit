import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoCamera } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import UserService from "../../services/userService";

function EditProfil1() {
  const navigate = useNavigate();
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    noHP: "",
    tanggalLahir: ""
  });

  // Ambil data user saat komponen dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Untuk demo, selalu pastikan ada token dummy
        let token = localStorage.getItem("token");
        if (!token) {
          token = "dummy-token-123";
          localStorage.setItem("token", token);
        }

        if (user) {
          // Jika ada data user di context, gunakan itu
          setFormData({
            nama: user.name || "",
            email: user.email || "",
            noHP: user.phone || "",
            tanggalLahir: user.birthDate || ""
          });
        } else {
          // Jika tidak ada data user di context, coba ambil dari backend/localStorage
          try {
            const response = await UserService.getProfile();
            const userData = response.user;

            setFormData({
              nama: userData.name || "",
              email: userData.email || "",
              noHP: userData.phone || "",
              tanggalLahir: userData.birthDate || ""
            });
          } catch (err) {
            console.error("Error fetching user data:", err);

            // Jika gagal mengambil data dari backend, coba ambil dari localStorage
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              setFormData({
                nama: userData.name || "",
                email: userData.email || "",
                noHP: userData.phone || "",
                tanggalLahir: userData.birthDate || ""
              });
            } else {
              // Jika tidak ada data di localStorage, buat data dummy
              // Coba ambil email dari localStorage jika ada
              let email = "user@example.com";
              try {
                const storedEmail = localStorage.getItem("lastEmail");
                if (storedEmail) {
                  email = storedEmail;
                }
              } catch (e) {
                console.error("Error getting email from localStorage:", e);
              }

              // Gunakan email sebagai basis untuk nama user
              const userName = email.split('@')[0];

              const dummyUser = {
                id: "user123",
                name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize first letter
                email: email,
                phone: "0812-1130-7064",
                token: token
              };

              localStorage.setItem("user", JSON.stringify(dummyUser));

              setFormData({
                nama: dummyUser.name,
                email: dummyUser.email,
                noHP: dummyUser.phone,
                tanggalLahir: ""
              });
            }
          }
        }
      } catch (err) {
        console.error("Error in useEffect:", err);
        setError("Terjadi kesalahan saat memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk menangani unggah foto profil
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file (hanya gambar)
    if (!file.type.startsWith('image/')) {
      setError("Hanya file gambar yang diperbolehkan");
      return;
    }

    // Validasi ukuran file (maksimal 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB");
      return;
    }

    // Untuk demo, kita hanya menampilkan nama file
    // Di implementasi sebenarnya, file akan diunggah ke server
    setSuccess(`Foto profil ${file.name} berhasil diunggah`);

    // Simulasi unggah foto ke server
    // Dalam implementasi sebenarnya, gunakan FormData dan fetch API
    console.log("Foto profil yang akan diunggah:", file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset pesan error dan success
    setError("");
    setSuccess("");

    // Validasi input
    if (!formData.nama.trim()) {
      setError("Nama tidak boleh kosong");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email tidak boleh kosong");
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid");
      return;
    }

    try {
      setLoading(true);

      // Untuk demo, selalu pastikan ada token dummy
      let token = localStorage.getItem("token");
      if (!token) {
        token = "dummy-token-123";
        localStorage.setItem("token", token);
      }

      // Siapkan data untuk dikirim ke backend
      const userData = {
        name: formData.nama,
        email: formData.email,
        phone: formData.noHP,
        birthDate: formData.tanggalLahir,
        token: token // Pastikan token tetap ada
      };

      // Jika terhubung ke backend, gunakan updateUserData dari AuthContext
      if (updateUserData) {
        try {
          await updateUserData(userData);
        } catch (updateErr) {
          console.error("Error using updateUserData:", updateErr);

          // Jika gagal menggunakan updateUserData, gunakan UserService
          await UserService.updateProfile(userData);
        }
      } else {
        // Jika tidak ada updateUserData, gunakan UserService
        await UserService.updateProfile(userData);
      }

      setSuccess("Profil berhasil diperbarui");

      // Redirect ke halaman profil setelah 1 detik
      setTimeout(() => {
        navigate("/profil");
      }, 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Gagal memperbarui profil. Silakan coba lagi.");

      // Untuk demo, tetap simpan ke localStorage meskipun terjadi error
      try {
        const userData = {
          name: formData.nama,
          email: formData.email,
          phone: formData.noHP,
          birthDate: formData.tanggalLahir,
          token: "dummy-token-123"
        };

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const currentUser = JSON.parse(storedUser);
          const updatedUser = { ...currentUser, ...userData };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          setSuccess("Profil berhasil diperbarui (mode demo)");

          // Redirect ke halaman profil setelah 1 detik
          setTimeout(() => {
            navigate("/profil");
          }, 1000);
        } else {
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", "dummy-token-123");

          setSuccess("Profil berhasil diperbarui (mode demo)");

          // Redirect ke halaman profil setelah 1 detik
          setTimeout(() => {
            navigate("/profil");
          }, 1000);
        }
      } catch (innerErr) {
        console.error("Error in error handling:", innerErr);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] flex flex-col items-center px-2 pt-4 pb-4">
      {/* Card Container */}
      <div className="w-full max-w-[434px] bg-white rounded-b-3xl shadow-md flex flex-col overflow-hidden">

        {/* Header (sticky di atas) */}
        <div className="flex items-center px-4 py-4 border-b bg-white sticky top-0 z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <IoArrowBack size={22} />
          </button>
          <h2 className="flex-1 text-center text-lg font-bold font-jakarta">
            Edit Profil
          </h2>
          <div className="w-6" />
        </div>

        {/* Body/Form */}
        <div className="flex-1 overflow-y-auto p-6 font-jakarta">
          {/* Foto Profil */}
          <div className="flex flex-col items-center mb-6">
            <label htmlFor="photo-upload" className="cursor-pointer">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2 relative overflow-hidden">
                {user && user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IoCamera size={28} className="text-gray-500" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <IoCamera size={28} className="text-white" />
                </div>
              </div>
              <p className="text-xs text-gray-600">Ganti Foto</p>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Loading, Error, dan Success Message */}
          {loading && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
              <p className="text-sm">Memproses...</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
              <p className="text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sporta-blue"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sporta-blue"
                required
              />
            </div>

            {/* No. HP */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                No. HP
              </label>
              <input
                type="tel"
                name="noHP"
                value={formData.noHP}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sporta-blue"
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sporta-blue"
              />
            </div>

            {/* Tombol Simpan */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-sporta-blue text-white py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfil1;
