const { Reportes } = require("../models/reportes");
const { generateReportPDF } = require("../libs/export");
const { Usuario } = require("../models/usuarios");
const { Equipos } = require("../models/dispositivos");
const { Area } = require("../models/area");
const { Prioridad } = require("../models/prioridad");
const { TipoReporte } = require("../models/tipoReportes");
const { Consumible } = require("../models/consumible");
const { Estado } = require("../models/estados");
const fs = require("fs");

async function getReportes(req, res) {
    try {
        const reportes = await Reportes.findAll({
            include: [
                Prioridad,
                TipoReporte,
                Usuario,
                Area,
                Consumible,
                Estado,
            ],
        });

        const reportesFormateados = reportes.map((report) => ({
            prioridad: report.Prioridad.valor,
            tipo: report.TipoReporte.tipo,
            usuario: `${report.Usuario.nombre} ${report.Usuario.apellido}`,
            area: report.Area.area,
            consumible: report.Consumible.nombre,
            descripcion: report.descripcion,
            falloReportado: report.falloReportado,
            equipoReportado: report.EquipoNoInventario,
            fecha: report.fecha,
            capacitacionSolicitada: report.capacitacionSolicitada,
            estado: report.Estado.estado,
            id: report.id,
        }));

        console.log(reportesFormateados);
        res.json(reportesFormateados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

async function getReporte(req, res) {
    try {
        const { id } = req.params;
        const report = await Reportes.findByPk(id, {
            include: [
                Prioridad,
                TipoReporte,
                Usuario,
                Area,
                Consumible,
                Estado,
            ],
        });

        if (report) {
            const reportFormateado = {
                prioridad: report.Prioridad.valor,
                tipo: report.TipoReporte.tipo,
                usuario: `${report.Usuario.nombre} ${report.Usuario.apellido}`,
                area: report.Area.area,
                consumible: report.Consumible.nombre,
                descripcion: report.descripcion,
                falloReportado: report.falloReportado,
                equipoReportado: report.EquipoNoInventario,
                fecha: report.fecha,
                capacitacionSolicitada: report.capacitacionSolicitada,
                estado: report.Estado.estado,
                id: report.id,
            };

            return res.json(reportFormateado);
        } else {
            return res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Error interno del servidor" });
    }
}

async function createReporte(req, res) {
    try {
        const {
            idTipoReporte,
            prioridadId,
            descripcion,
            area,
            consumible,
            falloReportado,
            equipoReportado,
            estado,
            capacitacionSolicitada,
            imgData
        } = req.body;
        const idUsuario = req.user.id;

        // const imgPath = imgData.toString().replace('/src', 'storage');

        const prefix = "storage"

        const imgPath = `${prefix}${imgData.toString()}`;

        const areaId = (await Area.findOne({ where: { area: area } }))
            .dataValues.id;

        const consumibleId = (
            await Consumible.findOne({ where: { nombre: consumible } })
        ).dataValues.id;

        const estadoId = (await Estado.findOne({ where: { estado: estado } }))
            .dataValues.id;

        const newReportBody = {
            AreaId: areaId, //ok
            ConsumibleId: consumibleId, //ok
            descripcion: descripcion, //ok
            falloReportado: falloReportado, //ok
            EstadoId: estadoId, //ok
            EquipoNoInventario: equipoReportado,
            fecha: new Date(), //ok
            PrioridadId: prioridadId, //ok
            TipoReporteId: idTipoReporte, //ok
            UsuarioId: idUsuario, //ok
            capacitacionSolicitada: capacitacionSolicitada, //ok
            dataImg: imgPath,
        };

        await Reportes.create(newReportBody);

        return res.status(201).json({ message: "Reporte Creado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Error interno del servidor" });
    }
}

async function updateReporte(req, res) {
    try {
        const { id } = req.params;
        const { descripcion, idPrioridad, idTipoReporte, idUsuario, idEquipo } =
            req.body;
        if (Object.entries(req.body).length === 0)
            return res.status(400).json({ message: "Bad request" });
        const updatedBody = {
            descripcion: descripcion,
            fecha: new Date(),
            PrioridadId: idPrioridad,
            TipoReporteId: idTipoReporte,
            UsuarioId: idUsuario,
            EquipoId: idEquipo,
        };
        const updated = await Reportes.update(updatedBody, {
            where: { id: id },
        });
        if (updated[0] === 0)
            return res.json({ message: "Reporte no actualizado" });
        else return res.json({ msg: "Reporte Actualizado" });
    } catch (err) {
        res.json({ err: err });
    }
}

async function deleteReporte(req, res) {
    try {
        const { id } = req.params;
        const reportFound = await Reportes.findByPk(id);
        if (reportFound) {
            await Reportes.destroy({ where: { id: id } });
            return res.json({ message: "Reporte Borrado" });
        } else {
            return res.status(404).json({ error: "Not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error });
    }
}

async function sendFileReporte(req, res) {
    const capitalizeWord = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    const { id } = req.params;

    if (id === "last") {
        return res.status(200).json({ data: await Reportes.max("id") });
    }

    const reportFound = await Reportes.findByPk(id);

    console.log(reportFound);

    const userFound = await Usuario.findByPk(
        await reportFound.dataValues.UsuarioId
    );
    // const equipoFound = await Equipos.findByPk(await reportFound.dataValues.EquipoId)
    const areaFound = await Area.findOne({
        where: { id: reportFound.dataValues.AreaId },
    });

    const tipo = (await reportFound.getTipoReporte()).tipo;

    let solicitud = await reportFound.dataValues.EquipoNoInventario;

    if (tipo.toString().toUpperCase() === "CONSUMIBLE") {
        solicitud = (
            await Consumible.findByPk(reportFound.dataValues.ConsumibleId)
        ).nombre;
    } else if (tipo.toString().toUpperCase() === "CAPACITACIÓN") {
        solicitud = reportFound.dataValues.capacitacionSolicitada;
    }

    if (fs.existsSync(reportFound.dataValues.dataImg)) {
        const img = fs.readFileSync(reportFound.dataValues.dataImg);
        console.log(img);
        console.log("tipo", typeof img);
    } else {
        console.log('El archivo no existe:', reportFound.dataValues.dataImg);
    }

    const reportData = {
        tipo: tipo,
        content: {
            // equipo: equipoFound.dataValues.nombre || "El equipo no tiene nombre",
            elementoSolicitado: solicitud,
            area: areaFound.dataValues.area || "El equipo no tiene area",
            prioridad: (await reportFound.getPrioridad()).valor,
            usuario:
                `${capitalizeWord(
                    userFound.dataValues.nombre
                )} ${capitalizeWord(userFound.dataValues.apellido)}` ||
                "Sin nombre",
            falloReportado: reportFound.dataValues.falloReportado,
            estado: (await reportFound.getEstado()).estado,
        },
        description: {
            descripcion: reportFound.dataValues.descripcion,
            observaciones: "",
        },
        icon: {
            path: fs.readFileSync(reportFound.dataValues.dataImg)
        }
    };

    const file = Buffer.from(await generateReportPDF(reportData));
    res.contentType("application/pdf");
    res.status(200).send(file);
}

// async function getLastPdf(req, res){
//     const lastReportId = await Reportes.max('id');

//     console.log('last id',lastReportId);

//     req.params.id = lastReportId;

//     await sendFileReporte(req, res);
// }

module.exports = {
    getReportes,
    getReporte,
    sendFileReporte,
    createReporte,
    updateReporte,
    deleteReporte,
};
