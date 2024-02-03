const Mongoose = require("mongoose");

const DireccionSchema = new Mongoose.Schema({
  calle: {
    type: String,
    required: true,
  },
  altura: {
    type: Number,
    required: true,
  },
  localidad: {
    type: String,
    required: true,
  },
  ciudad: {
    type: String,
    required: true,
  },
});

const UsuarioSchema = new Mongoose.Schema(
  {
    apellido: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    direccion: {
      type: DireccionSchema,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    usuario: {
      type: String,
      required: true,
    },
    fecha_nac: {
      type: String,
      required: true,
    },
    fecha_alta: String,
    activo: Boolean,
    fecha_baja: String,
  },
  { collection: "usuarios" }
);

const Usuario = Mongoose.model("usuarios", UsuarioSchema);

module.exports = Usuario;
