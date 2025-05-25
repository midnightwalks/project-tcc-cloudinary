import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_NAME: name,
  DB_HOST: host,
  DB_USERNAME: username,
  DB_PASSWORD: password,
} = process.env;

const db = new Sequelize(name, username, password, {
  host: host,
  dialect: "mysql",
});

export default db;
db.sync();
