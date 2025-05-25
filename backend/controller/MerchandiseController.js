import Merchandise from "../model/MerchandiseModel.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import fs from "fs";

// 🔎 helper upload
const uploadToCloudinary = async (file, folder) => {
  if (!file) return null;

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

  const result = await cloudinary.uploader.upload(file.path, {
    folder,
    use_filename: true,
    unique_filename: false,
  });

  fs.unlink(file.path, (err) =>
    err && console.error("Gagal menghapus file lokal:", err)
  );
  return result;
};

// CREATE
export const createMerchandise = async (req, res) => {
  try {
    const { nama_barang, harga_barang, deskripsi, stok } = req.body;
    const file = req.file;

    if (!nama_barang || !harga_barang || !deskripsi || !stok) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    let imageUrl = null;
    if (file) {
      const uploadResult = await uploadToCloudinary(
        file,
        "Konser-App/Merchandise_Images"
      );
      imageUrl = uploadResult.secure_url;
    }

    const merchandise = await Merchandise.create({
      nama_barang,
      harga_barang,
      deskripsi,
      gambar: imageUrl,
      stok,
    });

    res.status(201).json({
      message: "Merchandise berhasil dibuat",
      data: merchandise,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ (semua)
export const getMerchandise = async (req, res) => {
  try {
    const merchandises = await Merchandise.findAll();

    res.status(200).json({
      message: "Data merchandise berhasil diambil",
      data: merchandises,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateMerchandise = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_barang, harga_barang, deskripsi, stok } = req.body;
    const file = req.file;

    const merchandise = await Merchandise.findByPk(id);
    if (!merchandise)
      return res.status(404).json({ message: "Merchandise tidak ditemukan" });

    const updatedFields = {
      nama_barang: nama_barang || merchandise.nama_barang,
      harga_barang: harga_barang || merchandise.harga_barang,
      deskripsi: deskripsi || merchandise.deskripsi,
      stok: stok || merchandise.stok,
    };

    if (file) {
      // Hapus gambar lama
      if (merchandise.gambar) {
        const publicId =
          "Konser-App/Merchandise_Images/" +
          merchandise.gambar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const uploadResult = await uploadToCloudinary(
        file,
        "Konser-App/Merchandise_Images"
      );
      updatedFields.gambar = uploadResult.secure_url;
    }

    await merchandise.update(updatedFields);

    res.status(200).json({
      message: "Merchandise berhasil diupdate",
      data: merchandise,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteMerchandise = async (req, res) => {
  try {
    const { id } = req.params;

    const merchandise = await Merchandise.findByPk(id);
    if (!merchandise)
      return res.status(404).json({ message: "Merchandise tidak ditemukan" });

    // Hapus gambar dari Cloudinary
    if (merchandise.gambar) {
      const publicId =
        "Konser-App/Merchandise_Images/" +
        merchandise.gambar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await merchandise.destroy();

    res.status(200).json({
      message: "Merchandise berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
