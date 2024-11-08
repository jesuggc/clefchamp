const sql = require("mysql")

class DAO {
    constructor(host, user, password, database,port) {
        this.pool = sql.createPool({
            host: host,
            user: user,
            password: password,
            database: database,
            port: port
        })
    }
//USUARIOS
      
    checkEmail(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) callback(err, null)
            else {
                let stringQuery = "SELECT id FROM usuarios WHERE email LIKE ?"
                connection.query(stringQuery, email.email, (err, resultado) => {
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
                        let user = { 
                            id:resultado[0].id,
                            name:resultado[0].name,
                            tagname:resultado[0].tagname,
                            email:resultado[0].email,
                            icon:resultado[0].icon,
                            joindate:resultado[0].joindate
                        }
                        console.log(user)
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
                let stringQuery = "INSERT INTO usuarios (tagname, email, password, name, icon) VALUES (?,?,?,?,?)"
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

}
module.exports = DAO