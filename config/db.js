console.log(process.env.NODE_ENV)
require("dotenv").config({
    path: process.env.NODE_ENV === "development" ? '.env' : '.env.production' 
    // path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' 
});
console.log(process.env.NODE_ENV)
const DAO = require("./dao");

const db = new DAO(
    process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_NAME,
    process.env.DB_PORT
);

module.exports = db;