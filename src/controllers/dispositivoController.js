const { Equipos } = require('../models/dispositivos.js')
const {Area} = require("../models/area");

async function getDispositivos(req, res) {
    try {
        const equipos = await Equipos.findAll();
        res.json(equipos)
    }
    catch (error) {
        console.log(error);
    }
}

async function getDispositivo(req, res) {
    try {
        const {id} = req.params;
        const equipo = await Equipos.findByPk(id)
        if (equipo)
            res.json(equipo);
        else
            res.json({error: "No se encontro el equipo solicitado"});
    }
    catch (error) {
        console.log(error);
    }
}

async function createDispositivo(req, res) {
    try {
        const { nombre, marca, modelo, area, descripcion} = req.body;
        const existingEquipo = await Equipos.findOne({where: {'nombre': nombre, 'marca': marca, 'modelo': modelo}});
        if(existingEquipo) return res.json({message: "Equipo ya existente"})
        const areaId = (await Area.findOne({where: {'id': area}}))
        const newEquipo = {
            nombre: nombre.toLowerCase(), marca, modelo, AreaId : areaId.id, descripcion
        }
        await Equipos.create(newEquipo);
        return res.json({message: "Equipo creado!"});
    }
    catch (err) {
        res.status(500).json({error: "El equipo no fue creado..." + err});
    }
}

async function updateDispositivo(req, res) {
    try {
        const { id }= req.params;
        const {nombre, marca, modelo, area, descripcion} = req.body;
        if (Object.entries(req.body).length === 0) return res.status(400).json({message: "Bad request, check your body request"})
        const areaId = (await Area.findOne({where: {'id': area}}))
        const newEquipo = {
            nombre: nombre.toLowerCase(), marca, modelo, AreaId: areaId.id, descripcion
        }
        const upd = await Equipos.update(newEquipo, {where : {'id': id}})
        if (upd[0] > 0) res.json({message: "Equipo actualizado"})
        else res.json({message: "Equipo NO se pudo actualizar"})
    }
    catch (err) {
        res.status(400).json({error: "El equipo no se pudo actualizar, revisar la informacion enviada"});
    }
}

async function deleteDispositivo(req, res) {
    try {
        const {id} = req.params;
        if((await Equipos.findByPk(id))) {
            await Equipos.destroy({where: {id: id}})
            res.json({message: 'Dispositivo Borrado'});
        } else {
            res.status(404).json({error: 'Equipo not found'})
        }
    }
    catch (error) {
        console.log(error);
    }
}

module.exports ={
    getDispositivos,
    createDispositivo,
    getDispositivo,
    deleteDispositivo,
    updateDispositivo
}