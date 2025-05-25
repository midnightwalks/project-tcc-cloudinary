import DaftarKonser from "../model/DaftarKonserModel.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import fs from "fs";        // masih dipakai kalau suatu saat kamu kembali ke diskStorage

// 🔎 helper – meng‐upload dari buffer ATAU dari path, tergantung apa yang tersedia
const uploadToCloudinary = async (file, folder) => {
  if (!file) return null;

  // 1️⃣  Jika pakai memoryStorage → file.buffer tersedia
  if (file.buffer) {
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    return cloudinary.uploader.upload(dataUri, {
      folder,
      use_filename: true,
      unique_filename: false,
    });
  }

  // 2️⃣  Jika tetap pakai diskStorage → file.path tersedia
  const result = await cloudinary.uploader.upload(file.path, {
    folder,
    use_filename: true,
    unique_filename: false,
  });
  // hapus file lokal
  fs.unlink(file.path, (err) =>
    err && console.error("Gagal menghapus file lokal:", err)
  );
  return result;
};

// CREATE
export const createKonser = async (req, res) => {
  try {
    const { nama_konser, harga_tiket, tanggal, tempat, waktu, deskripsi } =
      req.body;
    const file = req.file;

    // validasi sederhana
    if (
      !nama_konser ||
      !harga_tiket ||
      !tanggal ||
      !tempat ||
      !waktu ||
      !deskripsi
    ) {
      return res
        .status(400)
        .json({ message: "Semua field wajib diisi" });
    }

    let imageUrl = null;
    if (file) {
      const uploadResult = await uploadToCloudinary(
        file,
        "Konser-App/Konser_Images"
      );
      imageUrl = uploadResult.secure_url;
    }

    const konser = await DaftarKonser.create({
      nama_konser,
      harga_tiket,
      tanggal,
      tempat,
      waktu,
      deskripsi,
      gambar: imageUrl,
    });

    res.status(201).json({
      message: "Konser berhasil dibuat",
      data: konser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ (semua / satu)
export const getKonser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = id
      ? await DaftarKonser.findByPk(id)
      : await DaftarKonser.findAll();

    if (!data)
      return res.status(404).json({ message: "Konser tidak ditemukan" });

    res.status(200).json({
      message: "Data konser berhasil diambil",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateKonser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_konser,
      harga_tiket,
      tanggal,
      tempat,
      waktu,
      deskripsi,
    } = req.body;
    const file = req.file;

    const konser = await DaftarKonser.findByPk(id);
    if (!konser)
      return res.status(404).json({ message: "Konser tidak ditemukan" });

    const updatedFields = {
      nama_konser: nama_konser || konser.nama_konser,
      harga_tiket: harga_tiket || konser.harga_tiket,
      tanggal: tanggal || konser.tanggal,
      tempat: tempat || konser.tempat,
      waktu: waktu || konser.waktu,
      deskripsi: deskripsi || konser.deskripsi,
    };

    // handle gambar baru
    if (file) {
      // hapus gambar lama di Cloudinary
      if (konser.gambar) {
        const publicId =
          "Konser-App/Konser_Images/" +
          konser.gambar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const uploadResult = await uploadToCloudinary(
        file,
        "Konser-App/Konser_Images"
      );
      updatedFields.gambar = uploadResult.secure_url;
    }

    await konser.update(updatedFields);
    res.status(200).json({
      message: "Data konser berhasil diupdate",
      data: konser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteKonser = async (req, res) => {
  try {
    const { id } = req.params;
    const konser = await DaftarKonser.findByPk(id);
    if (!konser)
      return res.status(404).json({ message: "Konser tidak ditemukan" });

    // hapus gambar Cloudinary
    if (konser.gambar) {
      const publicId =
        "Konser-App/Konser_Images/" +
        konser.gambar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await konser.destroy();
    res.status(200).json({ message: "Data konser berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
