const { Op } = require("sequelize");
const { Equipos } = require("../models/dispositivos.js");
const { TipoEquipo } = require("../models/tipoEquipos.js");
const { Area } = require("../models/area");
const { capitalizeFirstLetter } = require("../libs/utils.js");

async function getDispositivos(req, res) {
    try {
        const equipos = await Equipos.findAll({
            where: { no_inventario: { [Op.ne]: "No aplica" } },
            include: [TipoEquipo, Area],
        });

        const equiposFormateados = equipos.map((equipo) => ({
            no_inventario: equipo.no_inventario,
            nombre: equipo.nombre,
            marca: equipo.marca,
            modelo: equipo.modelo,
            area: equipo.Area.area,
            tipo: equipo.TipoEquipo.tipo,
            descripcion: equipo.descripcion,
            fecha_instalacion: equipo.fecha_instalacion,
        }));

        res.status(200).json(equiposFormateados);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: {error: "No se pudieron obtener los equipos"} });
    }
}

async function getDispositivo(req, res) {
    try {
        const { id } = req.params;
        const equipo = await Equipos.findByPk(id);
        if (equipo) res.json(equipo);
        else res.json({ error: "No se encontro el equipo solicitado" });
    } catch (error) {
        console.log(error);
    }
}

async function getDispositivosByAreaAndType(req, res) {
    try {
        const area = req.params.area;
        const tipo = req.params.tipo;
        console.log(area, tipo);
        const areaId = await Area.findOne({ where: { area: area } });
        const tipoEquipoId = await TipoEquipo.findOne({
            where: { tipo: tipo },
        });
        const equipos = await Equipos.findAll({
            where: { AreaId: areaId.id, TipoEquipoId: tipoEquipoId.id },
        });

        const inventoryNumbers = equipos.map((equipo) => ({
            no_inventario: equipo.no_inventario,
            marca: equipo.marca,
            modelo: equipo.modelo,
        }));
        res.status(200).json(inventoryNumbers);
    } catch (error) {
        console.log(error);
    }
}

async function createDispositivo(req, res) {
    try {
        const {
            noInventario,
            nombre,
            marca,
            modelo,
            area,
            descripcion,
            tipoEquipo,
            fechaInstalacion,
        } = req.body;

        console.log(req.body);

        const existingEquipo = await Equipos.findOne({
            where: { no_inventario: noInventario },
        });

        if (existingEquipo) return res.json({ message: "Equipo ya existente" });

        const areaId = await Area.findOne({ where: { area: area } });

        const tipoEquipoId = await TipoEquipo.findOne({
            where: { tipo: tipoEquipo },
        });

        const newEquipo = {
            no_inventario: noInventario,
            nombre: capitalizeFirstLetter(nombre),
            marca: capitalizeFirstLetter(marca),
            modelo: modelo.toString().toUpperCase(),
            AreaId: areaId.id,
            descripcion,
            TipoEquipoId: tipoEquipoId.id,
            fecha_instalacion: fechaInstalacion,
        };

        console.log('newEquipo', newEquipo);

        await Equipos.create(newEquipo);
        return res.status(201).json({ message: "Equipo creado!" });
    } catch (err) {
        res.status(500).json({ message: {error: "El equipo no fue creado..." + err} });
    }
}

async function updateDispositivo(req, res) {
    try {
        const { id } = req.params;
        const { nombre, marca, modelo, area, descripcion } = req.body;
        if (Object.entries(req.body).length === 0)
            return res
                .status(400)
                .json({ message: "Bad request, check your body request" });
        const areaId = await Area.findOne({ where: { id: area } });
        const newEquipo = {
            nombre: nombre.toLowerCase(),
            marca,
            modelo,
            AreaId: areaId.id,
            descripcion,
        };
        const upd = await Equipos.update(newEquipo, { where: { id: id } });
        if (upd[0] > 0) res.json({ message: "Equipo actualizado" });
        else res.json({ message: "Equipo NO se pudo actualizar" });
    } catch (err) {
        res.status(400).json({
            error: "El equipo no se pudo actualizar, revisar la informacion enviada",
        });
    }
}

async function deleteDispositivo(req, res) {
    try {
        const { id } = req.params;
        if (await Equipos.findByPk(id)) {
            await Equipos.destroy({ where: { id: id } });
            res.json({ message: "Dispositivo Borrado" });
        } else {
            res.status(404).json({ error: "Equipo not found" });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getDispositivos,
    getDispositivosByAreaAndType,
    createDispositivo,
    getDispositivo,
    deleteDispositivo,
    updateDispositivo,
};
