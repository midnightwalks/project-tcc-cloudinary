// src/api/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://project-backend-598740328533.us-central1.run.app", // Ganti dengan base URL backend-mu
  withCredentials: true, // untuk kirim cookie kalau dibutuhkan
});

export default instance;

