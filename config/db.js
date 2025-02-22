require("dotenv").config({ path: process.env.NODE_ENV === "development" ? '.env' : '.env.production' });

let mysqlConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
}

module.exports = mysqlConfig;