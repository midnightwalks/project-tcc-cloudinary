import db from "../config/Database.js";
import Users from "./UsersModel.js";
import DaftarKonser from "./DaftarKonserModel.js";
import Merchandise from "./MerchandiseModel.js";

// Relasi
Users.hasMany(DaftarKonser, { foreignKey: "userId", onDelete: "CASCADE" });
DaftarKonser.belongsTo(Users, { foreignKey: "userId" });

Users.hasMany(Merchandise, { foreignKey: "userId", onDelete: "CASCADE" });
Merchandise.belongsTo(Users, { foreignKey: "userId" });

// Fungsi sinkronisasi database
(async () => {
  try {
    await db.authenticate();
    console.log("Koneksi database berhasil!");

    await db.sync();
    console.log("Semua tabel berhasil disinkronisasi.");
  } catch (err) {
    console.error("Gagal konek DB:", err);
  }
})();

export default syncDB;
export { Users, DaftarKonser, Merchandise };
