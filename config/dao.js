const { user } = require("./db");

class DAO {
    constructor(pool) { this.pool = pool; }

    checkEmail(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                console.log(email)
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
                            icon:resultado[0].icon,
                            friendCode:resultado[0].friendCode,
                            joindate
                        }
                        callback(null, user)
                    } 
                })
            }
        })
    }

    
    getVerifiedUsers(callback){ //TODO CONFIRMAR CORREO ESTO ESTARIA GUAPO TAMBIEN Jaja
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT u.id, u.nombre, u.apellido1, u.apellido2, u.correo, u.admin, u.curso, u.foto, f.nombre as nombreFacultad, g.nombre as nombreGrado FROM usuarios as u JOIN ucm_aw_riu_fac_facultades as f ON u.facultad = f.id JOIN ucm_aw_riu_gra_grados AS g ON u.grado = g.id WHERE verificado = 1 AND admin=0"
                connection.query(stringQuery, (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null)
                    // else if (resultado.length === 0) callback(null,null)
                    else {
                        callback(null, resultado.map(ele => ({  
                            id:ele.id,
                            nombre:ele.nombre,
                            apellido1:ele.apellido1,
                            apellido2:ele.apellido2,
                            correo:ele.correo,
                            admin:ele.admin,
                            grado:ele.nombreGrado, 
                            curso:ele.curso,
                            foto: ele.foto
                        })))
                        
                    }
                })
            }
        })
    }
   
    getRequests(callback) { 
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT u.id, u.nombre, u.apellido1, u.apellido2, u.correo, u.admin, u.curso, u.foto, f.nombre as nombreFacultad, g.nombre as nombreGrado FROM ucm_aw_riu_usu_usuarios as u JOIN ucm_aw_riu_fac_facultades as f ON u.facultad = f.id JOIN ucm_aw_riu_gra_grados AS g ON u.grado = g.id WHERE verificado = 0"
                connection.query(stringQuery, (err, resultado) => {
                    connection.release();
                    if (err) callback(err, null)
                    else if (resultado.length === 0) callback(null,null)
                    else {
                        callback(null, resultado.map(ele => ({  
                            id:ele.id,
                            nombre:ele.nombre,
                            apellido1:ele.apellido1,
                            apellido2:ele.apellido2,
                            correo:ele.correo,
                            admin:ele.admin,
                            facultad:ele.nombreFacultad,
                            grado:ele.nombreGrado, 
                            curso:ele.curso,
                            foto: ele.foto
                        })))
                    }
                })
            }
        })
    }
 
    dropRequest(id,callback) {  // TODO PERMITIR AL USUARIO DARSE DE BAJA ESTA ES BuEna
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "DELETE FROM usuarios WHERE id = ?"
                connection.query(stringQuery, id,(err, resultado) => {
                    connection.release();
                    if (err) callback(err)
                    else callback(null, true)
                })
            }
        })
    }

    createUser(user,callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "INSERT INTO usuarios (tagname, email, password, name, friendCode, icon) VALUES (?,?,?,?,?,?)"
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

    getIcons(callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT * FROM icons"
                connection.query(stringQuery, (err, resultado) => {
                    connection.release();
                    if (err) callback(err)
                    else callback(null, resultado.map(ele => ({  
                        id:ele.id,
                        name:ele.name,
                        path:ele.path,
                        unlockCondition: ele.unlockCondition
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

    getInitialIcons(userId, callback) {
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

    unlockIcon(userId, iconId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                console.log("DAO" + userId)
                console.log("DAO" + iconId)
                let stringQuery = "INSERT INTO userIcons (userId, iconId, isSelected, bgColor) VALUES (?,?,?,?)"
                connection.query(stringQuery, [userId, iconId, 0, "transparent"], (err, resultado) => {
                    connection.release();
                    if (err) return callback(err, null);
                    callback(null, true);
                })
            }
        })
    }
}
   
module.exports = DAO;
