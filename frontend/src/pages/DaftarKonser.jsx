import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/utils.js";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance.js";
import useAuth from "../auth/useAuth.js";

function DaftarKonserApp() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [konserList, setKonserList] = useState([]);
  const [namaKonser, setNamaKonser] = useState("");
  const [hargaTiket, setHargaTiket] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tempat, setTempat] = useState("");
  const [waktu, setWaktu] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambarFile, setGambarFile] = useState(null); // File object
  const [gambarPreview, setGambarPreview] = useState(""); // Preview URL

  useEffect(() => {
    fetchKonser();
  }, []);

  const fetchKonser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/daftarkonser`);
      setKonserList(response.data.data);
    } catch (error) {
      console.error("Error fetching daftar konser:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Hanya file gambar (JPEG, PNG, GIF) yang diperbolehkan!');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Ukuran file terlalu besar! Maksimal 5MB.');
        return;
      }

      setGambarFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setGambarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file change for editing
  const handleEditFileChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Hanya file gambar (JPEG, PNG, GIF) yang diperbolehkan!');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Ukuran file terlalu besar! Maksimal 5MB.');
        return;
      }

      // Update the konser list with file object and preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setKonserList((prev) =>
          prev.map((konser) =>
            konser.id === id 
              ? { 
                  ...konser, 
                  gambarFile: file,
                  gambarPreview: e.target.result
                } 
              : konser
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const addKonser = async () => {
    if (!namaKonser.trim() || !hargaTiket || !tanggal || !tempat.trim() || !waktu.trim() || !deskripsi.trim()) {
      alert('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nama_konser', namaKonser);
      formData.append('harga_tiket', Number(hargaTiket));
      formData.append('tanggal', tanggal);
      formData.append('tempat', tempat);
      formData.append('waktu', waktu);
      formData.append('deskripsi', deskripsi);
      
      if (gambarFile) {
        formData.append('gambar', gambarFile);
      }

      const response = await axios.post(`${BASE_URL}/daftarkonser`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.data) {
        setKonserList((prev) => [...prev, response.data.data]);
        // Reset form
        setNamaKonser("");
        setHargaTiket("");
        setTanggal("");
        setTempat("");
        setWaktu("");
        setDeskripsi("");
        setGambarFile(null);
        setGambarPreview("");
        // Reset file input
        document.getElementById('gambar-input').value = '';
        alert('Konser berhasil ditambahkan!');
      }
    } catch (error) {
      console.error("Error adding daftar konser:", error);
      alert('Gagal menambahkan konser. Silakan coba lagi.');
    }
  };

  const deleteKonser = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus konser ini?')) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/daftarkonser/${id}`);
      setKonserList((prev) => prev.filter((konser) => konser.id !== id));
      alert('Konser berhasil dihapus!');
    } catch (error) {
      console.error("Error deleting daftar konser:", error);
      alert('Gagal menghapus konser. Silakan coba lagi.');
    }
  };

  const toggleEditMode = (id) => {
    setKonserList((prev) =>
      prev.map((konser) =>
        konser.id === id ? { ...konser, isEditing: !konser.isEditing } : konser
      )
    );
  };

  const handleInputChange = (id, field, value) => {
    setKonserList((prev) =>
      prev.map((konser) =>
        konser.id === id ? { ...konser, [field]: value } : konser
      )
    );
  };

  const saveKonser = async (id, updatedKonser) => {
    if (
      !updatedKonser.nama_konser.trim() ||
      !updatedKonser.harga_tiket ||
      !updatedKonser.tanggal ||
      !updatedKonser.tempat.trim() ||
      !updatedKonser.waktu.trim() ||
      !updatedKonser.deskripsi.trim()
    ) {
      alert('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nama_konser', updatedKonser.nama_konser);
      formData.append('harga_tiket', Number(updatedKonser.harga_tiket));
      formData.append('tanggal', updatedKonser.tanggal);
      formData.append('tempat', updatedKonser.tempat);
      formData.append('waktu', updatedKonser.waktu);
      formData.append('deskripsi', updatedKonser.deskripsi);
      
      if (updatedKonser.gambarFile) {
        formData.append('gambar', updatedKonser.gambarFile);
      } else if (updatedKonser.gambar) {
        formData.append('existing_gambar', updatedKonser.gambar);
      }

      const response = await axios.put(`${BASE_URL}/daftarkonser/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.data) {
        await fetchKonser();
        alert('Konser berhasil diperbarui!');
      } else {
        alert("Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error updating daftar konser:", error);
      alert('Gagal memperbarui konser. Silakan coba lagi.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleRefresh = async () => {
    await fetchKonser();
  };

  return (
    <div className="min-h-screen bg-purple-100 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-purple-700">Daftar Konser</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          Back
        </button>
      </div>

      <div className="flex flex-1 gap-6 flex-col md:flex-row">
        {/* KIRI: List konser dalam kotak-kotak grid */}
        <div className="flex-1 bg-white rounded-lg shadow p-4 overflow-auto max-h-[70vh]">
          <div className="flex justify-between items-center mb-4 border-b border-purple-200 pb-2">
            <h2 className="font-semibold text-lg text-purple-900">List Konser</h2>
          </div>

          {konserList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {konserList.map((konser) => (
                <div
                  key={konser.id}
                  className="bg-purple-50 rounded-lg p-4 flex flex-col shadow"
                >
                  {konser.isEditing ? (
                    <>
                      <input
                        type="text"
                        value={konser.nama_konser}
                        onChange={(e) => handleInputChange(konser.id, "nama_konser", e.target.value)}
                        placeholder="Nama Konser"
                        className="mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        type="number"
                        value={konser.harga_tiket}
                        onChange={(e) => handleInputChange(konser.id, "harga_tiket", e.target.value)}
                        placeholder="Harga Tiket"
                        className="mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        type="date"
                        value={konser.tanggal}
                        onChange={(e) => handleInputChange(konser.id, "tanggal", e.target.value)}
                        className="mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        type="text"
                        value={konser.tempat}
                        onChange={(e) => handleInputChange(konser.id, "tempat", e.target.value)}
                        placeholder="Tempat"
                        className="mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        type="text"
                        value={konser.waktu}
                        onChange={(e) => handleInputChange(konser.id, "waktu", e.target.value)}
                        placeholder="Waktu (misal: 19:00)"
                        className="mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <textarea
                        value={konser.deskripsi}
                        onChange={(e) => handleInputChange(konser.id, "deskripsi", e.target.value)}
                        placeholder="Deskripsi"
                        rows={3}
                        className="mb-2 p-2 border rounded resize-y focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      
                      {/* Current image display */}
                      {(konser.gambarPreview || konser.gambar) && (
                        <div className="mb-2">
                          <img
                            src={konser.gambarPreview || `${BASE_URL}/uploads/${konser.gambar}`}
                            alt="Preview"
                            className="h-32 w-full object-cover rounded"
                          />
                        </div>
                      )}
                      
                      {/* File input for editing */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleEditFileChange(konser.id, e)}
                        className="mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => {
                            saveKonser(konser.id, konser);
                            toggleEditMode(konser.id);
                          }}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                        >
                          💾 Simpan
                        </button>
                        <button
                          onClick={() => toggleEditMode(konser.id)}
                          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded"
                        >
                          ✖ Batal
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {konser.gambar ? (
                        <img
                          src={`${BASE_URL}/uploads/${konser.gambar}`}
                          alt={konser.nama_konser}
                          className="h-40 w-full object-cover rounded mb-3"
                          onLoad={() => console.log('Image loaded:', `${BASE_URL}/uploads/${konser.gambar}`)}
                          onError={(e) => {
                            console.error('Image failed to load:', `${BASE_URL}/uploads/${konser.gambar}`);
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280">No Image</text></svg>';
                          }}
                        />
                      ) : (
                        <div className="h-40 w-full bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400 italic">
                          No Image
                        </div>
                      )}

                      <h3 className="text-xl font-semibold mb-1">{konser.nama_konser}</h3>
                      <p className="text-purple-700 font-bold mb-1">
                        Rp {Number(konser.harga_tiket).toLocaleString("id-ID")}
                      </p>
                      <p className="mb-1">Tanggal: {konser.tanggal}</p>
                      <p className="mb-1">Tempat: {konser.tempat}</p>
                      <p className="mb-1">Waktu: {konser.waktu}</p>
                      <p className="text-gray-700 text-sm line-clamp-3 mb-4">{konser.deskripsi}</p>
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => toggleEditMode(konser.id)}
                          className="flex-1 bg-purple-400 hover:bg-purple-500 text-white py-2 rounded"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteKonser(konser.id)}
                          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">Tidak ada data konser.</p>
          )}
        </div>

        {/* KANAN: Form input tambah konser */}
        <div className="w-full md:w-96 bg-purple-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Tambah Konser</h2>

          <input
            type="text"
            value={namaKonser}
            onChange={(e) => setNamaKonser(e.target.value)}
            placeholder="Nama Konser"
            className="w-full px-3 py-2 border border-purple-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <input
            type="number"
            value={hargaTiket}
            onChange={(e) => setHargaTiket(e.target.value)}
            placeholder="Harga Tiket"
            className="w-full px-3 py-2 border border-purple-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full px-3 py-2 border border-purple-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <input
            type="text"
            value={tempat}
            onChange={(e) => setTempat(e.target.value)}
            placeholder="Tempat"
            className="w-full px-3 py-2 border border-purple-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <input
            type="text"
            value={waktu}
            onChange={(e) => setWaktu(e.target.value)}
            placeholder="Waktu (misal: 19:00)"
            className="w-full px-3 py-2 border border-purple-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Deskripsi"
            rows={4}
            className="w-full px-3 py-2 border border-purple-300 rounded mb-3 resize-y focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          
          {/* File input for image upload */}
          <input
            id="gambar-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-purple-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          
          {/* Image preview */}
          {gambarPreview && (
            <div className="mb-3">
              <img
                src={gambarPreview}
                alt="Preview"
                className="w-full h-32 object-cover rounded border"
              />
            </div>
          )}

          <button
            onClick={addKonser}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded shadow"
          >
            ➕ Tambah Konser
          </button>
        </div>
      </div>
    </div>
  );
}

export default DaftarKonserApp;