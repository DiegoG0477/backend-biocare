const bcrypt = require("bcryptjs"); // modulo para la encriptacion de las claves
const authMiddleware = require('../middlewares/authMiddleware');
const { Rol } = require('../models/roles');
const { Usuario } = require('../models/usuarios');

async function encryptPassword(password) { // encripta la contraseña que sera enviada a la base de datos
    return await bcrypt.hashSync(password ,bcrypt.genSaltSync(10));
}
async function authPassword(password, hash) { //Compara la contraseña ingresada con la que esta encriptada en la db
    return await bcrypt.compareSync(password, hash); 
}

async function login(req, res) {
    try {
        const { password, correo } = req.body;
        const result = (await Usuario.findAll({where: {'correo': correo}}))
            if (result.length === 1) {
                const validation = await authPassword(password, result[0].dataValues.password);
                console.log(validation)
                if(validation){
                    const token = authMiddleware.generateToken(result[0].dataValues);

                    res.json({message : "Usuario autenticado", usuario: result[0].dataValues, token: token});
                }
                else
                  res.json({ message: "Credenciales incorrectas" });
            } else {
              res.json({ message: "Usuario no encontrado"})
        }
    } catch (err) {
        console.log(err)
      res.status(500).json({ error : err})
    }
}

async function register(req, res){
    try {
        const { correo, password , nombre, apellidoPaterno, apellidoMaterno, rol } = req.body;
        if(await Usuario.findOne({where: {'correo': correo}})) return res.status(400).json({msg: "Usuario ya existe"})

        const rolId = (await Rol.findOne({where: {'rol': rol}})).dataValues.id;

        const newUser = {
            correo: correo,
            password: await encryptPassword(password),
            nombre: nombre,
            apellido: `${apellidoPaterno} ${apellidoMaterno}`,
            rolId: rolId
        }
        await Usuario.create(newUser);
        res.status(201).json({message: "Usuario creado exitosamente"})
    } catch (e) {
        console.log(e) //logger.error(e)
        res.status(500).json({error: e, message: "Datos invalidos"})
    }
}

module.exports = {
    encryptPassword,
    authPassword,
    login,
    register
};