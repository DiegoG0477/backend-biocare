//////////////////////Arranque de aplicación/////////////////////////////
/////////////////////////////////////////////////////////////////////////
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { router } = require("./routes/index.js");

const dotenv = require("dotenv");
dotenv.config();

////////// Inicialización //////////
const app = express();

////////// Middlewares //////////
app.use(
    cors({
        origin: "https://biocare.freemyip.com", // Permitir solicitudes desde este dominio
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
    })
);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false })); // Para aceptar los formularios de los usuarios.
app.use(express.json());

//////////Variables globales //////////
const PORT = process.env.PORT || 4000;

////////// Configuración //////////
app.set("port", PORT || 4000);

//              ROUTER                 //
app.use("/", router);

////////// Public //////////
app.use(express.static(path.join(__dirname, "public")));

////////// Start Server //////////
app.listen(PORT, () => {
    console.log("Server | PORT", PORT);
});
