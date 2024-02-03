const Express = require("express");
const UsuariosRouter = Express.Router();

const {
  readAllUsuarios,
  readUsuarioById,
  createUsuario,
  updateUsuarioById,
  deleteUsuarioById,
} = require("../controllers/usuarioController");

const { requiredScopes } = require("express-oauth2-jwt-bearer");

UsuariosRouter.get("/", requiredScopes("read:usuarios"), readAllUsuarios);
UsuariosRouter.get("/:id", requiredScopes("read:usuarios"), readUsuarioById);
UsuariosRouter.post("/", requiredScopes("write:usuarios"), createUsuario);
UsuariosRouter.put("/:id", requiredScopes("write:usuarios"), updateUsuarioById);
UsuariosRouter.delete("/:id", requiredScopes("write:usuarios"), deleteUsuarioById);

module.exports = UsuariosRouter;
