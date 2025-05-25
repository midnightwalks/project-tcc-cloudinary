import express from "express";
import multer from "multer";
import {
  createKonser,
  getKonser,
  updateKonser,
  deleteKonser,
} from "../controller/DaftarKonserController.js";
import {
  createMerchandise,
  getMerchandise,
  updateMerchandise,
  deleteMerchandise,
} from "../controller/MerchandiseController.js";
import {
  Register,
  Login,
  refreshToken,
  logout,
} from "../controller/UsersController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ====== CLOUDINARY MULTER CONFIG FOR MEMORY STORAGE ======
const storage = multer.memoryStorage(); // simpan file di memori
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file harus gambar (jpeg/png/jpg/gif)"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // maksimal 5MB
});

// ====== USER ROUTES ======
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

// ====== DAFARKONSER ROUTES (pakai Cloudinary) ======
router.get("/daftarkonser", getKonser);
router.get("/daftarkonser/:id", getKonser);
router.post("/daftarkonser", verifyToken, upload.single('gambar'), createKonser);
router.put("/daftarkonser/:id", verifyToken, upload.single('gambar'), updateKonser);
router.delete("/daftarkonser/:id", verifyToken, deleteKonser);

// ====== MERCHANDISE ROUTES (sudah dimodifikasi untuk pakai Cloudinary juga) ======
router.get("/merchandise", getMerchandise);
router.get("/merchandise/:id", getMerchandise);
router.post("/merchandise", verifyToken, upload.single('gambar'), createMerchandise);
router.put("/merchandise/:id", verifyToken, upload.single('gambar'), updateMerchandise);
router.delete("/merchandise/:id", verifyToken, deleteMerchandise);

// ====== CATCH ALL ROUTE ======
router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
