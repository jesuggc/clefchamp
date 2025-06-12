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

    checkUser(tagnameOrEmail, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT * FROM usuarios WHERE (tagname LIKE ? OR email LIKE ?)"
                connection.query(stringQuery, [tagnameOrEmail,tagnameOrEmail], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null)
                    else if (resultado.length === 0) callback()
                    else {
                        let date = new Date(resultado[0].joindate);

                        let day = date.getDate();
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
                            friendCode:resultado[0].friendCode,
                            active:resultado[0].active,
                            password:resultado[0].password,
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
                let stringQuery = "INSERT INTO usuarios (tagname, email, password, name, friendCode) VALUES (?,?,?,?,?)"
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
                let stringQuery = "SELECT i.id, i.name, i.path, i.unlockCondition, ui.isSelected FROM icons as i JOIN usericons as ui ON i.id = ui.iconId WHERE ui.userId = ? AND i.isDefault = 0;"
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

    unlockInitialIcons(userId,callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = `
                    INSERT INTO usericons (userId, iconId, isSelected, bgColor)
                    SELECT ?, id, isDefault, "transparent"
                    FROM icons
                    WHERE unlockOnCreate = 1;
                `
                connection.query(stringQuery, [userId], (err, resultado) => {
                    connection.release();
                    if (err) return callback(err, null);
                    callback(null, true);
                })
            }
        })
    }

    unlockIcon(userId, iconId, value,callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "INSERT INTO usericons (userId, iconId, isSelected, bgColor) VALUES (?,?,?,?)"
                connection.query(stringQuery, [userId, iconId, value, "transparent"], (err, resultado) => {
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
                let query = `
                            SELECT 
                            u.id, 
                            u.tagname, 
                            u.email, 
                            u.friendCode, 
                            r.gameId, 
                            r.time, 
                            ui.bgColor, 
                            i.path, 
                            r.points
                            FROM userrecord r
                            JOIN (
                                SELECT userId, MAX(points) AS maxPoints
                                FROM userrecord
                                WHERE difficulty = ?
                                GROUP BY userId
                            ) maxr ON r.userId = maxr.userId AND r.points = maxr.maxPoints
                            JOIN usuarios u ON r.userId = u.id
                            JOIN usericons ui ON u.id = ui.userId
                            JOIN icons i ON i.id = ui.iconId
                            WHERE ui.isSelected = 1 AND r.difficulty = ?
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
                ui.isSelected = 1 AND u.id = ?;`
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
                let query = `UPDATE usericons SET isSelected = 0 WHERE userId = ? AND isSelected = 1`
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
                let query = `UPDATE usericons SET isSelected = 1, bgColor = ? WHERE userId = ? AND iconId = ?`
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
                let query = `SELECT DATE(time) AS fecha, MAX(points) AS puntos FROM userrecord WHERE userId = ? AND difficulty=? GROUP BY DATE(time) ORDER BY fecha;`
                connection.query(query, [id,difficulty], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }

    getUserByFriendcode(friendCode, ownId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `
                SELECT DISTINCT u.id, u.tagname, i.path, ui.bgColor, a.state, a.userId, a.friendId
                FROM usuarios AS u
                JOIN usericons AS ui ON u.id = ui.userId
                JOIN icons AS i ON ui.iconId = i.id
                LEFT JOIN amigos AS a 
                ON (
                    (a.userId = ? AND a.friendId = u.id) OR 
                    (a.friendId = ? AND a.userId = u.id)
                    )
                WHERE ui.isSelected = 1
                AND u.friendCode = ?
                AND u.id != ?;
                ;`
                connection.query(query,[ownId,ownId,friendCode,ownId], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }
    sendRequest(ownId, friendId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `INSERT INTO amigos (userId, friendId, state) VALUES (?, ?, 'pendiente');`
                connection.query(query,[ownId,friendId], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }


    getSentRequests(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `   SELECT u.id, u.tagname, u.friendCode, i.path, ui.bgColor 
                                FROM amigos AS a JOIN usuarios AS u ON a.friendId = u.id JOIN usericons AS ui ON u.id = ui.userId JOIN icons AS i ON ui.iconId = i.id
                                WHERE a.userId=? AND state='pendiente' AND ui.isSelected=1;`
                connection.query(query,id, (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }

    getReceivedRequests(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `
                                SELECT u.id, u.tagname, u.friendCode, i.path, ui.bgColor 
                                FROM amigos AS a JOIN usuarios AS u ON a.userId = u.id JOIN usericons AS ui ON u.id = ui.userId JOIN icons AS i ON ui.iconId = i.id
                                WHERE a.friendId=? AND state='pendiente' AND ui.isSelected=1;`
                connection.query(query,id, (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }
    getFriends(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `
                        SELECT DISTINCT u.id, u.tagname, u.friendCode, i.path, ui.bgColor
                        FROM amigos AS a
                        JOIN usuarios AS u ON (a.friendId = u.id AND a.userId = ?) OR (a.userId = u.id AND a.friendId = ?)
                        JOIN usericons AS ui ON u.id = ui.userId
                        JOIN icons AS i ON ui.iconId = i.id
                        WHERE a.state = 'aceptado'
                        AND ui.isSelected = 1
                        AND u.id != ?;
                `
                connection.query(query,[id,id,id], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }

    acceptRequest(selfId,friendId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `
                    UPDATE amigos SET state = 'aceptado' WHERE userId = ? AND friendId = ?;
                `
                connection.query(query,[friendId,selfId], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }

    dropRequest(selfId,friendId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null);
            else {
                let query = `
                        DELETE FROM amigos WHERE userId = ? AND friendId = ?;
                `
                connection.query(query,[friendId, selfId], (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null);
                    else callback(null, resultado);
                });
            }
        });
    }
   

    
    
    }
   
module.exports = DAO;
