import { Sequelize } from "sequelize";
import { getEnv } from "../utils.js";

const {
  DB_HOST: host,
  DB_NAME: name,
  DB_USERNAME: username,
  DB_PASSWORD: password,
} = getEnv();

const db = new Sequelize(name, username, password, {
  host: host,
  dialect: "mysql",
});

export default db;
