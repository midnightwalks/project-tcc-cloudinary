import { Sequelize } from "sequelize";
import { getEnv } from "../utils.js";

dotenv.config();

const {
  DB_HOST: host,
  DB_USERNAME: username,
  DB_PASSWORD: password,
  DB_NAME: name,
} = getEnv();

const db = new Sequelize(name, username, password, {
  host: host,
  dialect: "mysql",
});

export default db;
