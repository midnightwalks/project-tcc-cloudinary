import React from "react";
import { useNavigate } from "react-router-dom";

export default function Documentation() {
  const navigate = useNavigate();

  const apiDocs = [
    {
      method: "POST",
      endpoint: "/register",
      deskripsi: "Register user baru",
      body: { "username": "...", "password": "..." },
      response: "201 Created, 500 Error",
    },
    {
      method: "POST",
      endpoint: "/login",
      deskripsi: "Login dan dapatkan token",
      body: { "username": "...", "password": "..." },
      response: "200 OK, 401/404 Error",
    },
    {
      method: "GET",
      endpoint: "/token",
      deskripsi: "Refresh token dari cookie",
      body: "-",
      response: "200 OK, 401/403 Error",
    },
    {
      method: "DELETE",
      endpoint: "/logout",
      deskripsi: "Logout dan hapus refresh token",
      body: "-",
      response: "200 OK, 204 No Content",
    },
    {
      method: "GET",
      endpoint: "/daftarkonser",
      deskripsi: "Ambil semua data konser",
      body: "-",
      response: "200 OK",
    },
    {
      method: "GET",
      endpoint: "/daftarkonser/:id",
      deskripsi: "Ambil data konser berdasarkan ID",
      body: URL,
      Params: id,
      response: "200 OK, 404 Not Found",
    },
    {
      method: "POST",
      endpoint: "/daftarkonser",
      deskripsi: "Tambah data konser baru",
      body: { "nama": "...", "tanggal": "...", "lokasi": "..." },
      response: "201 Created, 400/500 Error",
    },
    {
      method: "PUT",
      endpoint: "/daftarkonser/:id",
      deskripsi: "Update data konser berdasarkan ID",
      body: { "nama": "...", "tanggal": "...", "lokasi": "..." },
      response: "200 OK, 400/404/500 Error",
    },
    {
      method: "DELETE",
      endpoint: "/daftarkonser/:id",
      deskripsi: "Hapus data konser berdasarkan ID",
      body: URL,
      Params: id,
      response: "200 OK, 404 Not Found",
    },
    {
      method: "GET",
      endpoint: "/merchandise",
      deskripsi: "Ambil semua data merchandise",
      body: "-",
      response: "200 OK",
    },
    {
      method: "GET",
      endpoint: "/merchandise/:id",
      deskripsi: "Ambil data merchandise berdasarkan ID",
      body: URL,
      Params: id,
      response: "200 OK, 404 Not Found",
    },
    {
      method: "POST",
      endpoint: "/merchandise",
      deskripsi: "Tambah data merchandise baru",
      body: { "nama": "...", "harga": "...", "stok": "..." },
      response: "201 Created, 400/500 Error",
    },
    {
      method: "PUT",
      endpoint: "/merchandise/:id",
      deskripsi: "Update data merchandise berdasarkan ID",
      body: { "nama": "...", "harga": "...", "stok": "..." },
      response: "200 OK, 400/404/500 Error",
    },
    {
      method: "DELETE",
      endpoint: "/merchandise/:id",
      deskripsi: "Hapus data merchandise berdasarkan ID",
      body: UR,
      Params: id,
      response: "200 OK, 404 Not Found",
    },
  ];

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-8 relative">
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-8 right-8 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        Back
      </button>

      <h1 className="text-4xl font-bold text-purple-700 mb-8 mt-4">Dokumentasi REST API</h1>

      <div className="overflow-x-auto w-full max-w-7xl bg-white rounded-lg shadow p-6">
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-purple-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Method</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Endpoint</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Deskripsi</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Body / Parameter</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Response</th>
            </tr>
          </thead>
          <tbody>
            {apiDocs.map((doc, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border border-gray-300 px-4 py-2">{doc.method}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.endpoint}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.deskripsi}</td>
                <td className="border border-gray-300 px-4 py-2 whitespace-pre-wrap">{doc.body}</td>
                <td className="border border-gray-300 px-4 py-2">{doc.response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}