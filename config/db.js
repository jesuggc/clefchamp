require("dotenv").config();
const DAO = require("./dao");

const db = new DAO(
    process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_NAME,
    process.env.DB_PORT
);

module.exports = db;