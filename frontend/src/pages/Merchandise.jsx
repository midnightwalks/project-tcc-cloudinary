// This file duplicates the image upload functionality from DaftarKonser.jsx to DaftarMerchandise.jsx
// and ensures the merchandise image form input behaves similarly to the concert form.

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
  const [gambarFile, setGambarFile] = useState(null);
  const [gambarPreview, setGambarPreview] = useState("");

  useEffect(() => {
    fetchMerch();
  }, []);

  const fetchMerch = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/merchandise`);
      setMerchList(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data merchandise:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert("Jenis file tidak valid. Gunakan JPG, PNG, atau GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar (maksimal 5MB)");
      return;
    }
    setGambarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setGambarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const addMerch = async () => {
    if (!namaMerch || !harga || !stok || !deskripsi || !gambarFile) {
      alert("Semua field wajib diisi termasuk gambar!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("nama_barang", namaMerch);
      formData.append("harga_barang", harga);
      formData.append("stok", stok);
      formData.append("deskripsi", deskripsi);
      formData.append("gambar", gambarFile);

      const response = await axios.post(`${BASE_URL}/merchandise`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.data) {
        fetchMerch();
        setNamaMerch("");
        setHarga("");
        setStok("");
        setDeskripsi("");
        setGambarFile(null);
        setGambarPreview("");
      }
    } catch (error) {
      console.error("Gagal menambahkan merchandise:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Merchandise</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Nama Merchandise"
          value={namaMerch}
          onChange={(e) => setNamaMerch(e.target.value)}
          className="block w-full mb-2 border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Harga"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          className="block w-full mb-2 border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Stok"
          value={stok}
          onChange={(e) => setStok(e.target.value)}
          className="block w-full mb-2 border p-2 rounded"
        />
        <textarea
          placeholder="Deskripsi"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="block w-full mb-2 border p-2 rounded"
        ></textarea>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full mb-2"
        />
        {gambarPreview && (
          <img
            src={gambarPreview}
            alt="Preview"
            className="w-full max-h-64 object-contain mb-2"
          />
        )}
        <button
          onClick={addMerch}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Tambah Merchandise
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {merchList.map((m) => (
          <div key={m.id} className="border p-4 rounded shadow">
            {m.gambar && (
              <img
                src={m.gambar}
                alt={m.nama_barang}
                className="w-full h-40 object-cover mb-2 rounded"
              />
            )}
            <h2 className="text-lg font-bold">{m.nama_barang}</h2>
            <p>Harga: Rp {Number(m.harga_barang).toLocaleString()}</p>
            <p>Stok: {m.stok}</p>
            <p>{m.deskripsi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DaftarMerchandiseApp;