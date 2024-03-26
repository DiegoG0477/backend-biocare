const auth = require('../controllers/authController');
const conexion = require('../database/conexion');
const query = require('../database/query')

async function login(req, res) {
  try {
    const {clave,nombre} = req.body;
    const hospital = nombre.toLowerCase(); // toda la cadena la hace en minusculas
    const db = await conexion.getConexion();
    let  login = await db.request()
    .input('Nombre', conexion.sql.VarChar, hospital)
    .query(query.loginHospital);
    const {Clave}= login.recordset[0];
    if (login.recordset.length > 0) {
      const validacion = await auth.authPassword(Clave,clave);
      if(validacion){
        const token = auth.creatToken(login.recordset[0]);    
        res.json({token});
      }
      else
        res.json({ text: "Clave Incorrecta" });
    }
    else
      res.send('hola te has logiado')  
  }
  catch (err) {
    console.log(err);
  }
}

async function registro(req, res) {
  try {
    var {nombre, clave} = req.body;
    nombre = nombre.toLowerCase();  // toda la cadena la hace en minusculas
    const contra =  await auth.encriptacion(clave) // encriptamos la clave
    const db = await conexion.getConexion();
    await db.request()
    .input('Nombre', conexion.sql.VarChar, nombre)
    .input('Clave', conexion.sql.VarChar,contra)
    .query(query.registroHospital);
    return res.send('hola');
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = {
  login,
  registro
}