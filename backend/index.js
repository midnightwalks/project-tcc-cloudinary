import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config(); // Load .env saat development
}

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import route from "./routes/route.js";
import syncDB from "./model/index.js"; // Pastikan ini return Promise/async

const app = express();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const corsOptions = {
  origin: ["https://project-konser-dot-a-06-new.uc.r.appspot.com/"], // sesuaikan dengan frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"], // jika perlu expose header ke frontend
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Untuk parsing form data
app.use(cookieParser());

// Jika gambar di Cloudinary, folder uploads tidak perlu di serve
// Kalau ada gambar lokal, bisa diaktifkan:
// app.use('/uploads', express.static('uploads'));

app.use(route);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Concert Ticket Backend API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
  });
});

// Start server setelah sinkronisasi DB selesai
syncDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Client URL: http://localhost:3000`);
    });
  })
  .catch((err) => {
    console.error("DB Sync Error:", err.message);
    process.exit(1);
  });
