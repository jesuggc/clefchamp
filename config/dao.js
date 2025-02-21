const mysql = require("mysql2/promise");

class DAO {
    constructor(host, user, password, database, port) {
        this.pool = mysql.createPool({
            host,
            user,
            password,
            database,
            port,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    // Método genérico para consultas
    async query(sql, params = []) {
        const connection = await this.pool.getConnection();
        try {
            const [results] = await connection.query(sql, params);
            return results;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    // USUARIOS
    async checkEmail(email) {
        const result = await this.query("SELECT id FROM usuarios WHERE email LIKE ?", [email]);
        return result.length === 0;
    }

    async checkTagname(tagname) {
        const result = await this.query("SELECT id FROM usuarios WHERE tagname LIKE ?", [tagname]);
        return result.length === 0;
    }

    async checkEmailOrTagname(tagnameOrEmail) {
        const result = await this.query("SELECT id FROM usuarios WHERE tagname LIKE ? OR email LIKE ?", [tagnameOrEmail, tagnameOrEmail]);
        return result.length === 1;
    }

    async checkUser(tagnameOrEmail, password) {
        const result = await this.query(
            "SELECT * FROM usuarios WHERE (tagname LIKE ? OR email LIKE ?) AND password LIKE ?",
            [tagnameOrEmail, tagnameOrEmail, password]
        );

        if (result.length === 0) return null;

        const { id, name, tagname, email, icon, friendCode, joindate } = result[0];
        const date = new Date(joindate);
        return {
            id,
            name,
            tagname,
            email,
            icon,
            friendCode,
            joindate: {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
            },
        };
    }

    async createUser(user) {
        const result = await this.query(
            "INSERT INTO usuarios (tagname, email, password, name, friendCode, icon) VALUES (?,?,?,?,?,?)",
            Object.values(user)
        );
        return result.insertId;
    }

    async getIcons() {
        const results = await this.query("SELECT * FROM icons");
        return results.map(({ id, name, path, unlockCondition }) => ({
            id,
            name,
            path,
            unlockCondition,
        }));
    }

    async getUserLevel(userId) {
        const results = await this.query("SELECT level, experience, experienceToNext FROM userlevel WHERE idUser = ?", [userId]);
        return results.length ? results[0] : null;
    }

    async updateUserLevel(userId, level, experience, experienceToNext) {
        await this.query(
            "UPDATE userlevel SET level = ?, experience = ?, experienceToNext = ? WHERE idUser = ?",
            [level, experience, experienceToNext, userId]
        );
        return true;
    }

    async getExperienceByLevel(level) {
        const result = await this.query("SELECT experienceRequired FROM levelprogression WHERE level = ?", [level]);
        return result.length ? result[0].experienceRequired : null;
    }
}

module.exports = DAO;
