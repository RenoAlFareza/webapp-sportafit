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
    tanggalLahir: "",
    photoUrl: ""
  });

  // Ambil data user saat komponen dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        console.log("Fetching user data for edit profile");

        // Cek apakah ada data user di context
        if (user) {
          console.log("Using user data from context:", user);
          setFormData({
            nama: user.name || "",
            email: user.email || "",
            noHP: user.phone || "",
            tanggalLahir: user.birthDate || "",
            photoUrl: user.photoUrl || ""
          });

          // Set image preview jika ada photoUrl
          if (user.photoUrl) {
            setImagePreview(user.photoUrl);
          }
          return;
        }

        // Cek apakah ada data user di localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log("Using user data from localStorage:", userData);
            setFormData({
              nama: userData.name || "",
              email: userData.email || "",
              noHP: userData.phone || "",
              tanggalLahir: userData.birthDate || "",
              photoUrl: userData.photoUrl || ""
            });

            // Set image preview jika ada photoUrl
            if (userData.photoUrl) {
              setImagePreview(userData.photoUrl);
            }
            return;
          } catch (parseErr) {
            console.error("Error parsing user data from localStorage:", parseErr);
          }
        }

        // Jika tidak ada di context atau localStorage, coba ambil dari API
        console.log("Fetching user data from API");
        const response = await UserService.getProfile();

        if (response && response.user) {
          const userData = response.user;
          console.log("User data from API:", userData);

          setFormData({
            nama: userData.name || "",
            email: userData.email || "",
            noHP: userData.phone || "",
            tanggalLahir: userData.birthDate || "",
            photoUrl: userData.photoUrl || ""
          });

          // Set image preview jika ada photoUrl
          if (userData.photoUrl) {
            setImagePreview(userData.photoUrl);
          }

          // Simpan data user ke localStorage untuk penggunaan berikutnya
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Terjadi kesalahan saat memuat data. Silakan coba lagi.");

        // Jika semua metode gagal, gunakan data kosong
        setFormData({
          nama: "",
          email: "",
          noHP: "",
          tanggalLahir: ""
        });
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

  // State untuk menyimpan preview gambar
  const [imagePreview, setImagePreview] = useState(null);

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

    // Buat URL untuk preview gambar
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);

    // Untuk demo, kita akan menggunakan FileReader untuk mengonversi gambar ke base64
    // sehingga bisa disimpan di localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
      // Simpan base64 string ke state untuk digunakan saat submit form
      const base64String = reader.result;
      // Simpan base64 string ke formData
      setFormData(prev => ({ ...prev, photoUrl: base64String }));
      setSuccess(`Foto profil berhasil diunggah. Klik Simpan untuk menyimpan perubahan.`);
    };
    reader.readAsDataURL(file);

    console.log("Foto profil yang akan diunggah:", file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting profile update form");

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

      // Siapkan data untuk update
      const userData = {
        name: formData.nama,
        email: formData.email,
        phone: formData.noHP,
        birthDate: formData.tanggalLahir,
        photoUrl: formData.photoUrl
      };

      console.log("Updating user data:", userData);

      // Update data di context jika tersedia
      if (updateUserData) {
        console.log("Using AuthContext.updateUserData");
        await updateUserData(userData);
      } else {
        console.log("Using UserService.updateProfile");
        await UserService.updateProfile(userData);
      }

      // Update data di localStorage
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const currentUser = JSON.parse(storedUser);
          const updatedUser = { ...currentUser, ...userData };

          // Pastikan token tetap ada
          if (!updatedUser.token) {
            updatedUser.token = "dummy-token-123";
          }

          console.log("Updating localStorage with:", updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          // Jika tidak ada user di localStorage, buat baru
          const newUser = {
            id: "user123",
            ...userData,
            token: "dummy-token-123"
          };
          console.log("Creating new user in localStorage:", newUser);
          localStorage.setItem("user", JSON.stringify(newUser));
          localStorage.setItem("token", "dummy-token-123");
        }
      } catch (storageErr) {
        console.error("Error updating localStorage:", storageErr);
      }

      setSuccess("Profil berhasil diperbarui");
      console.log("Profile updated successfully");

      // Redirect ke halaman profil setelah 1 detik
      setTimeout(() => {
        navigate("/profil");
      }, 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Gagal memperbarui profil. Silakan coba lagi.");

      // Fallback: update localStorage directly
      try {
        console.log("Fallback: updating localStorage directly");
        const userData = {
          name: formData.nama,
          email: formData.email,
          phone: formData.noHP,
          birthDate: formData.tanggalLahir,
          photoUrl: formData.photoUrl
        };

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const currentUser = JSON.parse(storedUser);
          const updatedUser = {
            ...currentUser,
            ...userData,
            token: currentUser.token || "dummy-token-123"
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          const newUser = {
            id: "user123",
            ...userData,
            token: "dummy-token-123"
          };
          localStorage.setItem("user", JSON.stringify(newUser));
          localStorage.setItem("token", "dummy-token-123");
        }

        setSuccess("Profil berhasil diperbarui (mode fallback)");

        // Redirect ke halaman profil setelah 1 detik
        setTimeout(() => {
          navigate("/profil");
        }, 1000);
      } catch (innerErr) {
        console.error("Error in fallback handling:", innerErr);
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
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2 relative overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
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
