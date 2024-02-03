const express = require("express");
const mongoose = require("mongoose");
const { auth } = require("express-oauth2-jwt-bearer");
const errorHandler = require("./middlewares/errorHandler");


require('dotenv').config();

// Configuracion Middleware con el Servidor de Autorización 
const autenticacion = auth({
  audience: process.env.OAUTH_AUDIENCE,
  issuerBaseURL: process.env.OAUTH_URL,
  tokenSigningAlg: "RS256",
});


const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB);
mongoose.connection.on(
  "error",
  console.error.bind(console, "Error de conexión a MongoDB: ")
);
mongoose.connection.once("open", () => {
  console.log("La conexión se estableció exitosamente");
});

// Rutas
const librosRouter = require("./routes/libros");
const usuariosRouter = require("./routes/usuarios");
//Configuramos el middleware de autenticacion
app.use("/api/libros", autenticacion,  librosRouter);
app.use("/api/usuarios", autenticacion,  usuariosRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});

module.exports = app;