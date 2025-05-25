import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_HOST: host,
  DB_USERNAME: username,
  DB_PASSWORD: password,
  DB_NAME: database,
} = getEnv();

const db = new Sequelize(database, username, password, {
  host: host,
  dialect: "mysql",
});

export default db;
db.sync();
