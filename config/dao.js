const { user } = require("./db");

class DAO {
    constructor(pool) { this.pool = pool; }

    checkEmail(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT id FROM usuarios WHERE email LIKE ?"
                connection.query(stringQuery, email, (err, resultado) => {
                    connection.release();
                    if (err) callback(err)
                    else callback(null, resultado.length === 0)
                })
            }
        })
    }

    checkTagname(tagname, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT id FROM usuarios WHERE tagname LIKE ?"
                connection.query(stringQuery, tagname, (err, resultado) => {
                    connection.release();
                    if (err) callback(err)
                    else callback(null, resultado.length === 0)
                })
            }
        })
    }

    checkEmailOrTagname(tagnameOrEmail, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT id FROM usuarios WHERE tagname LIKE ? OR email LIKE ?"
                connection.query(stringQuery, [tagnameOrEmail, tagnameOrEmail], (err, resultado) => {
                    connection.release();
                    if (err) callback(err)
                    else callback(null, resultado.length === 1)
                })
            }
        })
    }

    checkUser(tagnameOrEmail, password, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT * FROM usuarios WHERE (tagname LIKE ? OR email LIKE ?) AND password LIKE ?"
                connection.query(stringQuery, [tagnameOrEmail,tagnameOrEmail, password], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null)
                    else if (resultado.length === 0) callback()
                    else {
                        let date = new Date(resultado[0].joindate);

                        let day = date.getDate();          // Día del mes (1-31)
                        let month = date.getMonth() + 1;   // Mes (0-11, por lo que sumamos 1 para que sea 1-12)
                        let year = date.getFullYear();
                        let joindate = {
                            day,
                            month,
                            year
                        }
                        let user = { 
                            id:resultado[0].id,
                            name:resultado[0].name,
                            tagname:resultado[0].tagname,
                            email:resultado[0].email,
                            icon:resultado[0].icon, //remove
                            friendCode:resultado[0].friendCode,
                            joindate
                        }
                        callback(null, user)
                    } 
                })
            }
        })
    }

    createUser(user,callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "INSERT INTO usuarios (tagname, email, password, name, friendCode, icon) VALUES (?,?,?,?,?,?)" //remove icon
                connection.query(stringQuery, Object.values(user), (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null)
                    else {
                        let id = resultado.insertId
                        callback(null, id)
                    }
                })
            }
        })
    }

    getIconsFromId(id,callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT i.id, i.name, i.path, i.unlockCondition, ui.isSelected FROM icons as i JOIN usericons as ui ON i.id = ui.iconId WHERE ui.userId = ?;"
                connection.query(stringQuery,id, (err, resultado) => {
                    connection.release();
                    if (err) callback(err)
                    else callback(null, resultado.map(ele => ({  
                        id:ele.id,
                        name:ele.name,
                        path:ele.path,
                        unlockCondition: ele.unlockCondition,
                        isSelected: ele.isSelected
                    })))
                })
            }
        })
    }
    
    getUserLevel(userId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT * FROM userlevel WHERE idUser = ?"
                connection.query(stringQuery, [userId], (err, resultado) => {
                    connection.release();
                    if (err) callback(err)
                    else callback(null, resultado.map(ele => ({  
                            level:ele.level,
                            experience:ele.experience,
                            experienceToNext: ele.experienceToNext
                    })))
                })
            }
        })
    }

    updateUserLevel(userId, level, experience, experienceToNext, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err);
            else {
                let stringQuery = ` UPDATE userlevel SET level = ?, experience = ?, experienceToNext = ? WHERE idUser = ?`;
                connection.query(stringQuery, [level, experience, experienceToNext, userId], (err, result) => {
                    connection.release();
                    if (err) callback(err);
                    else callback(null, true);
                });
            }
        });
    }

    getExperienceByLevel(level, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err);
            else {
                let stringQuery = "SELECT experienceRequired FROM levelprogression WHERE level = ?";
                
                connection.query(stringQuery, [level], (err, result) => {
                    connection.release();
                    if (err) callback(err);
                    else  callback(null, result[0].experienceRequired);
                });
            }
        });
    }

    // getInitialIcons(userId, callback) {
    //     this.pool.getConnection((err, connection) => {
    //         if (err) callback(err, null)
    //         else {
    //             let stringQuery = "SELECT * FROM userlevel WHERE idUser = ?"
    //             connection.query(stringQuery, [userId], (err, resultado) => {
    //                 connection.release();
    //                 if (err) callback(err)
    //                 else callback(null, resultado.map(ele => ({  
    //                         level:ele.level,
    //                         experience:ele.experience,
    //                         experienceToNext: ele.experienceToNext
    //                 })))
    //             })
    //         }
    //     })
    // }

    unlockIcon(userId, iconId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "INSERT INTO usericons (userId, iconId, isSelected, bgColor) VALUES (?,?,?,?)"
                connection.query(stringQuery, [userId, iconId, 0, "transparent"], (err, resultado) => {
                    connection.release();
                    if (err) return callback(err, null);
                    callback(null, true);
                })
            }
        })
    }

    initializeExperience(userId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "INSERT INTO userlevel (idUser, level, experience, experienceToNext) VALUES (?,?,?,?)"
                connection.query(stringQuery, [userId, 1, 0, 150], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, true);
                })
            }
        })
    }

    getPreferences(userId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT * FROM userpreferences WHERE idUser = ?"
                connection.query(stringQuery, userId, (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else if (resultado.length === 0) callback(null, null)
                    else callback(null, resultado.map(ele => ({  
                        showTutorial:ele.showTutorial,
                    }))[0])
                })
            }
        })
    }

    hideTutorial(userId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "INSERT INTO userpreferences (idUser, showTutorial) VALUES (?,?)"
                connection.query(stringQuery, [userId,0], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null,true)
                })
            }
        })
    }

    saveRecord( id, dificultad, perfecto, excelente, genial, bien, ok, aciertos, fallos, puntuacion, tiemposIndividuales, notas, resultados, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `INSERT INTO userrecord 
                    (userId, difficulty, perfect, excellent, great, good, ok, success, error, points, notes, results, individualTimes) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                
                let values = [
                    id,
                    dificultad,
                    perfecto,
                    excelente,
                    genial,
                    bien,
                    ok,
                    aciertos,
                    fallos,
                    puntuacion,
                    JSON.stringify(notas), 
                    JSON.stringify(resultados),
                    JSON.stringify(tiemposIndividuales)
                ];
                connection.query(query, values, (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, true);
                });
            }
        });
    }

    getRecordsFromId(userId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = "SELECT * FROM userrecord WHERE userId = ? ORDER BY time DESC";
                connection.query(query, [userId], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else {
                        resultado = resultado.map(record => {
                            let date = new Date(record.time);
                            record.time = {
                                seconds: date.getSeconds().toString().padStart(2, '0'),
                                minutes: date.getMinutes().toString().padStart(2, '0'),
                                hour: date.getHours().toString().padStart(2, '0'),
                                day: date.getDate().toString().padStart(2, '0'), 
                                month: (date.getMonth() + 1).toString().padStart(2, '0'), 
                                year: date.getFullYear()
                            };
                            return record;
                        });
            
                        callback(null, resultado);
                    }
                });
            }
        });
    }
    
    getTopRecordsFromId(userId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = "SELECT * FROM userrecord WHERE userId = ? ORDER BY points DESC LIMIT 3";
                connection.query(query, [userId], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else {
                        resultado = resultado.map(record => {
                            let date = new Date(record.time);
                            record.time = {
                                day: date.getDate().toString().padStart(2, '0'), 
                                month: (date.getMonth() + 1).toString().padStart(2, '0'), 
                                year: date.getFullYear()
                            };
                            return record;
                        });
            
                        callback(null, resultado);
                    }
                });
            }
        });
    }

    getTopRecordsByDifficulty(difficulty, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                // let query = "SELECT u.id, u.tagname, u.email, u.name, u.icon, u.joindate, u.friendCode, r.gameId, r.time, r.difficulty, r.points " +
                // "FROM userrecord r JOIN usuarios u ON r.userId = u.id WHERE r.difficulty = ? ORDER BY r.points DESC LIMIT 10;"
                let query = `SELECT u.id, u.tagname, u.email, u.name, u.icon, u.joindate, u.friendCode, r.gameId, r.time, r.difficulty, r.points, ui.bgColor, i.path
                            FROM usuarios u
                            JOIN (
                                SELECT r.userId, r.gameId, r.time, r.difficulty, r.points
                                FROM userrecord r
                                WHERE r.difficulty = ?
                                AND r.points = (SELECT MAX(r2.points) FROM userrecord r2 WHERE r2.userId = r.userId AND r2.difficulty = ?)
                            ) r ON u.id = r.userId 
                            JOIN usericons as ui ON u.id = ui.userId JOIN icons as i ON i.id = ui.iconId 
                            WHERE ui.isSelected = 2
                            ORDER BY r.points DESC
                            LIMIT 10;
                            `
                connection.query(query, [difficulty, difficulty], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else {
                        resultado = resultado.map(record => {
                            let date = new Date(record.time);
                            record.time = {
                                day: date.getDate().toString().padStart(2, '0'), 
                                month: (date.getMonth() + 1).toString().padStart(2, '0'), 
                                year: date.getFullYear()
                            };
                            return record;
                        });
            
                        callback(null, resultado);
                    }
                });
            }
        });
    }

    getProfileIconFromId(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `SELECT ui.bgColor, i.path FROM icons as i JOIN usericons as ui ON i.id = ui.iconId JOIN usuarios as u on u.id = ui.userid WHERE 
                ui.isSelected = 2 AND u.id = ?;`
                connection.query(query, [id], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }

    setEmptySelectedIcon(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `UPDATE usericons SET isSelected = 1 WHERE userId = ? AND isSelected = 2`
                connection.query(query, [id], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }
    setSelectedIcon(id, iconId, bgColor, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `UPDATE usericons SET isSelected = 2, bgColor = ? WHERE userId = ? AND iconId = ?`
                connection.query(query, [bgColor,id,iconId], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }
    getStatsByIdAndDifficulty(id, difficulty, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `SELECT DATE(time) AS fecha, AVG(points) AS puntos FROM userrecord WHERE userId = ? AND difficulty=? GROUP BY DATE(time) ORDER BY fecha;`
                connection.query(query, [id,difficulty], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }
}
   
module.exports = DAO;
