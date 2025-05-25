import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/utils.js";
import { useNavigate } from "react-router-dom";
import axios from '../api/axiosInstance.js';
import useAuth from "../auth/useAuth.js";

function DaftarMerchandiseApp() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [merchList, setMerchList] = useState([]);
  const [namaMerch, setNamaMerch] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState(null);
  const [gambarPreview, setGambarPreview] = useState(""); // Preview URL

  useEffect(() => {
    fetchMerch();
  }, []);

// Handle file selection for adding merchandise
const handleMerchFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Hanya file gambar (JPEG, PNG, GIF) yang diperbolehkan!');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Ukuran file terlalu besar! Maksimal 5MB.');
      return;
    }

    setGambar(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setGambarPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

// Add merchandise
const addMerch = async () => {
  if (!namaMerch.trim() || !harga || !stok || !deskripsi.trim()) {
    alert('Mohon lengkapi semua field yang wajib diisi!');
    return;
  }

  try {
    const formData = new FormData();
    formData.append("nama_barang", namaMerch);
    formData.append("harga_barang", harga);
    formData.append("stok", stok);
    formData.append("deskripsi", deskripsi);
    if (gambar) {
      formData.append("gambar", gambar);
    }

    const response = await axios.post(`${BASE_URL}/merchandise`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.data) {
      const newItem = {
        ...response.data.data,
        harga: response.data.data.harga_barang,
        isEditing: false,
      };
      setMerchList((prev) => [...prev, newItem]);

      // Reset form
      setNamaMerch("");
      setHarga("");
      setStok("");
      setDeskripsi("");
      setGambar(null);
      setGambarPreview("");
      document.getElementById("gambar-merch-input").value = "";

      alert("Merchandise berhasil ditambahkan!");
    }
  } catch (error) {
    console.error("Error adding merchandise:", error);
    alert("Gagal menambahkan merchandise. Silakan coba lagi.");
  }
};

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-purple-100 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-purple-700">Daftar Merchandise</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          Back
        </button>
      </div>

      <div className="flex flex-1 gap-6 flex-col md:flex-row">
        <div className="flex-1 bg-white rounded-lg shadow p-4 overflow-auto max-h-[70vh]">
          <div className="flex justify-between items-center mb-4 border-b border-purple-200 pb-2">
            <h2 className="font-semibold text-lg text-purple-900">List Merchandise</h2>
          </div>

          {merchList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {merchList.map((merch) => (
                <div
                  key={merch.id}
                  className="bg-purple-50 rounded-lg p-4 flex flex-col shadow"
                >
                  {merch.isEditing ? (
                    <>
                      <input
                        type="text"
                        value={merch.nama_barang}
                        onChange={(e) => handleInputChange(merch.id, "nama_barang", e.target.value)}
                        placeholder="Nama Merchandise"
                        className="mb-2 p-2 border rounded"
                      />
                      <input
                        type="number"
                        value={merch.harga}
                        onChange={(e) => handleInputChange(merch.id, "harga", e.target.value)}
                        placeholder="Harga"
                        className="mb-2 p-2 border rounded"
                      />
                      <input
                        type="number"
                        value={merch.stok}
                        onChange={(e) => handleInputChange(merch.id, "stok", e.target.value)}
                        placeholder="Stok"
                        className="mb-2 p-2 border rounded"
                      />
                      <textarea
                        value={merch.deskripsi}
                        onChange={(e) => handleInputChange(merch.id, "deskripsi", e.target.value)}
                        placeholder="Deskripsi"
                        className="mb-2 p-2 border rounded"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleInputChange(merch.id, "gambar", e.target.files[0])}
                        className="mb-4 p-2 border rounded"
                      />
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => {
                            saveMerch(merch.id, merch);
                            toggleEditMode(merch.id);
                          }}
                          className="flex-1 bg-green-500 text-white py-2 rounded"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => toggleEditMode(merch.id)}
                          className="flex-1 bg-gray-400 text-white py-2 rounded"
                        >
                          Batal
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {merch.gambar ? (
                        <img
                          src={${BASE_URL}${merch.gambar}}
                          alt={merch.nama_barang}
                          className="h-40 w-full object-cover rounded mb-3"
                        />
                      ) : (
                        <div className="h-40 w-full bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400 italic">
                          No Image
                        </div>
                      )}
                      <h3 className="text-xl font-semibold mb-1">{merch.nama_barang}</h3>
                      <p className="text-purple-700 font-bold mb-1">
                        Rp {Number(merch.harga).toLocaleString("id-ID")}
                      </p>
                      <p className="mb-1">Stok: {merch.stok}</p>
                      <p className="text-gray-700 text-sm mb-4">{merch.deskripsi}</p>
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => toggleEditMode(merch.id)}
                          className="flex-1 bg-purple-400 text-white py-2 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMerch(merch.id)}
                          className="flex-1 bg-purple-500 text-white py-2 rounded"
                        >
                          Hapus
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">Tidak ada data merchandise.</p>
          )}
        </div>

        <div className="w-full md:w-96 bg-purple-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Tambah Merchandise</h2>

          <input
            type="text"
            value={namaMerch}
            onChange={(e) => setNamaMerch(e.target.value)}
            placeholder="Nama Merchandise"
            className="w-full px-3 py-2 border rounded mb-3"
          />
          <input
            type="number"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            placeholder="Harga"
            className="w-full px-3 py-2 border rounded mb-3"
          />
          <input
            type="number"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            placeholder="Stok"
            className="w-full px-3 py-2 border rounded mb-3"
          />
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Deskripsi"
            className="w-full px-3 py-2 border rounded mb-3"
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
            onClick={addMerch}
            className="w-full bg-purple-600 text-white py-3 rounded"
          >
            Tambah Merchandise
          </button>
        </div>
      </div>
    </div>
  );
}

export default DaftarMerchandiseApp;