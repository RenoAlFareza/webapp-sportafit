import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoCamera } from "react-icons/io5";
import { useState } from "react";

function EditProfil1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "Fajar Nugros",
    email: "designgraphic.fernando@gmail.com",
    noHP: "0812-1130-7064",
    tanggalLahir: "2005-02-19"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simpan data profil
    navigate("/profil1");
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#F9FAFB] px-4 py-6">
      <div className="w-full max-w-[434px] bg-white rounded-3xl shadow-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-4 py-4 border-b bg-white">
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

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 font-jakarta">
          {/* Foto Profil */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              <IoCamera size={28} className="text-gray-500" />
            </div>
            <p className="text-xs text-gray-600">Ganti Foto</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/** Nama Lengkap **/}
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
              />
            </div>

            {/** Email **/}
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
              />
            </div>

            {/** No. HP **/}
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

            {/** Tanggal Lahir **/}
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

            {/** Tombol Simpan **/}
            <button
              type="submit"
              className="w-full bg-sporta-blue text-white py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors"
            >
              Simpan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfil1;
