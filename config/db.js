// require("dotenv").config({
//     path: process.env.NODE_ENV === "development" ? '.env' : '.env.production' 
//     // path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' 
// });
const DAO = require("./dao");

// const db = new DAO(
//     process.env.DB_HOST,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     process.env.DB_NAME,
//     process.env.DB_PORT
// );
const db = new DAO(
    "mysql.railway.internal",
    "root",
    "OJSOuUDafqUzdKRiRGJIWeRxcAMgBsZT",
    "railway",
    3306
);

module.exports = db;