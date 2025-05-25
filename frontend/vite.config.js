// 1. Tambahkan import path dari Node.js
import path from 'path';

// 2. Karena kamu pakai ES modules (vite config pake import), kamu butuh ini
import { fileURLToPath } from 'url';

// 3. Definisikan __filename dan __dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 4. Import defineConfig dan plugin-plugin seperti biasa
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// 5. Ekspor konfigurasi Vite
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"), // Ini pakai __dirname yang udah didefinisikan
    },
  },
  server: {
    host: true,
    strictPort: true,
    port: 3000,
  },
});
