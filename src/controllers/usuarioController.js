const { Usuario } = require('../models/usuarios');
const { encryptPassword } = require("./authController");
const { Rol } = require("../models/roles");

async function getUsuarios(req, res){
    const response = (await Usuario.findAll());
    const result = response.map( async (r)=> {
        const rol = await Rol.findByPk(r.rolId);
        return {
           ...r.dataValues, rol: rol.rol
        }
    })
    res.send(await Promise.all(result));
}

async function getUsuario(req, res) {
    try {
        const { id } = req.params;
        const result = await Usuario.findByPk(id);
        const rol = await Rol.findByPk(result.dataValues.rol)
        if (result) {
            res.send({...result.dataValues, rol: rol.rol});
        }else {
            res.send('Usuario no encontrado');
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function updateUsuario(req, res) {
    try {
        const {id} = req.params;
        const { nombre, correo, apellido, rol } = req.body;
        if(await Usuario.findOne({where: {'correo': correo}})) return res.json({message: "El usuario con el correo provisto ya existe!"})
        const update = await Usuario.update({nombre: nombre, correo: correo, apellido: apellido, rol: rol}, {where: {id: id}})
        if(update[0] > 0){
            res.json({message: "Usuario actualizado"})
        } else {
            res.json({message: "Usuario no actualizado"})
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: "Hubo un error al actualizar"})
    }
}

async function updateUsuarioPassword(req, res){
    try {
        const { newPassword, confirmedNewPassword, usuario } = req.body;
        const userFound = await Usuario.findOne({where: {'correo': usuario }})
        if(!userFound) res.status(401).json({error: "Usuario invalido"})
        else {
            if(newPassword === confirmedNewPassword){
                const newPwdBody = {
                    password: await encryptPassword(newPassword), ...userFound
                }
                await Usuario.update(newPwdBody, {where: {id: userFound.id}});
                res.json({message: "Clave actualizada correctamente"})
            } else {
                res.status(400).json({ error: "Los datos ingresados no son validos"})
            }
        }
    } catch (e) {
        res.status(500).json({error: e})
    }
}

async function deleteUsuario(req, res) {
    try {
        const { id } = req.params;
        const dlt = await Usuario.destroy({where: {id: id}})
        if(dlt) res.json({message: "Usuario eliminado!"});
        else res.status(400).json({error: "Usuario invalido"})
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    getUsuarios,
    getUsuario,
    updateUsuario,
    updateUsuarioPassword,
    deleteUsuario
}