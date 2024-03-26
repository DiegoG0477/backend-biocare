module.exports = {
    //HOSPITAL QUERY'S
    loginHospital: "SELECT * FROM HOSPITAL WHERE Nombre = @Nombre;",
    hospital: "SELECT Nombre FROM HOSPITAL WHERE Id = @Id;",

    //USUARIO QUERY'S
    listaUsuarios: "SELECT * FROM USUARIO;",
    usuario: "SELECT * FROM USUARIO WHERE Id = @Id;",
    loginUsuario: "SELECT * FROM USUARIO WHERE Nombre = @Nombre AND Clave = @Clave;",
    registroUsuario: "INSERT INTO USUARIO (IdHospital, Nombre, Usuario, Clave) VALUES (@IdHospital, @Nombre, @Usuario, @Clave);",
    actualizarUsuario:
    "UPDATE USUARIO SET Nombre = @Nombre, Usuario = @Usuario, Clave = @Clave WHERE Id= @Id;",
    eliminarUsuario: "DELETE FROM USUARIO WHERE Id = @Id;",

    //EQUIPOS MEDICOS QUERY'S
    listaDispositivo: "SELECT * FROM DISPOSITIVO_MEDICO;",
    Dispositivo: "SELECT * FROM DISPOSITIVO_MEDICO WHERE Id = @Id;",
    registroDispositivo: "INSERT INTO DISPOSITIVO_MEDICO (IdHospital, Nombre, Area, Estado, Imagen) VALUES (@IdHospital, @Nombre, @Area, @Estado, @Imagen);",
    actualizarDispositivo:
    "UPDATE DISPOSITIVO_MEDICO SET Nombre = @Nombre, Area = @Area, Estado = @Estado, Imagen = @Imagen WHERE Id= @Id;",
    eliminarDispositivo: "DELETE FROM DISPOSITIVO_MEDICO WHERE Id = @Id;",

    //REPORTES QUERIES
    listaReporte: "SELECT * FROM REPORTE;",
    Reporte: "SELECT * FROM REPORTE WHERE Id = @Id;",
    registroReporte: "INSERT INTO REPORTE (IdDispositivo, Prioridad, Descripcion, Estado) VALUES (@IdDispositivo, @Prioridad, @Descripcion, @Estado);",
    actualizarReporte:
    "UPDATE REPORTE SET Prioridad = @Prioridad, Descripcion = @Descripcion, Estado = @Estado WHERE Id= @Id;",
    eliminarReporte: "DELETE FROM REPORTE WHERE Id = @Id;",
}