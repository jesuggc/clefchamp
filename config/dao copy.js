class DAO {
    constructor(pool) {
        this.pool = pool;
    }

    query(sql, params, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) return callback(err, null);
            connection.query(sql, params, (err, results) => {
                connection.release();
                if (err) return callback(err, null);
                callback(null, results);
            });
        });
    }

    checkEmail(email, callback) {
        this.query("SELECT id FROM usuarios WHERE email = ?", [email], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results.length === 0);
        });
    }

    checkTagname(tagname, callback) {
        this.query("SELECT id FROM usuarios WHERE tagname = ?", [tagname], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results.length === 0);
        });
    }

    checkEmailOrTagname(tagnameOrEmail, callback) {
        this.query(
            "SELECT id FROM usuarios WHERE tagname = ? OR email = ?",
            [tagnameOrEmail, tagnameOrEmail],
            (err, results) => {
                if (err) return callback(err, null);
                callback(null, results.length === 1);
            }
        );
    }

    checkUser(tagnameOrEmail, password, callback) {
        this.query(
            "SELECT * FROM usuarios WHERE (tagname = ? OR email = ?) AND password = ?",
            [tagnameOrEmail, tagnameOrEmail, password],
            (err, results) => {
                if (err) return callback(err, null);
                if (results.length === 0) return callback(null, null);
                const user = results[0];
                callback(null, {
                    id: user.id,
                    name: user.name,
                    tagname: user.tagname,
                    email: user.email,
                    icon: user.icon,
                    friendCode: user.friendCode,
                    joindate: {
                        day: user.joindate.getDate(),
                        month: user.joindate.getMonth() + 1,
                        year: user.joindate.getFullYear(),
                    },
                });
            }
        );
    }

    createUser(user, callback) {
        this.query(
            "INSERT INTO usuarios (tagname, email, password, name, friendCode, icon) VALUES (?,?,?,?,?,?)",
            Object.values(user),
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, result.insertId);
            }
        );
    }

    getIcons(callback) {
        this.query("SELECT * FROM icons", [], callback);
    }

    getUserLevel(userId, callback) {
        this.query("SELECT * FROM userlevel WHERE idUser = ?", [userId], callback);
    }

    insertInitialIcons(userId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) return callback(err, null);
    
            const query = "INSERT INTO userIcons (userId, iconId, isSelected, bgColor) VALUES ?";
            const values = [
                [userId, 1, 0, "transparent"],
                [userId, 2, 0, "transparent"],
                [userId, 3, 0, "transparent"],
                [userId, 4, 0, "transparent"]
            ];
    
            connection.query(query, [values], (err, result) => {
                connection.release();
                if (err) return callback(err, null);
                callback(null, true);
            });
        });
    }
    
}

module.exports = DAO;
