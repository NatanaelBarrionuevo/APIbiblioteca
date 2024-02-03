const Usuario = require("../models/usuarioModel");

let usuarios;
let error;

exports.readAllUsuarios = async (req, res, next) => {
  try {
    usuarios = await Usuario.find({ activo: true });
    if (usuarios.length === 0) {
      error = new Error("No se pudieron obtener los usuarios");
      throw error;
    }
    res.status(200).json(usuarios);
  } catch (err) {
    next(err);
  }
};

exports.readUsuarioById = async (req, res, next) => {
  try {
    const id = req.params.id;
    usuarios = await Usuario.find({ _id: id });

    if (!usuarios) {
      res
        .status(404)
        .json({ message: `No se encontró ningún usuario con el id ${id}` });
      return;
    }

    res.status(200).json(usuarios);
  } catch (err) {
    next(err);
  }
};

exports.createUsuario = async (req, res, next) => {
  try {
    const { nombre, apellido, direccion, usuario, email, fec_nac } = req.body;
    validarDireccion(direccion);
    validarUsuario(nombre, apellido, usuario, email, fec_nac);

    const fechaNacimiento = new Date(fec_nac);
    const fechaAlta = new Date();

    // Establecer horas, minutos, segundos y milisegundos en cero
    fechaNacimiento.setHours(0, 0, 0, 0);
    fechaAlta.setHours(0, 0, 0, 0);

    usuarios = await Usuario.create({
      nombre: nombre,
      apellido: apellido,
      direccion: direccion,
      email: email,
      usuario: usuario,
      fecha_nac: fechaNacimiento.toISOString(), // Almacena la fecha en formato ISO
      fecha_alta: fechaAlta.toISOString(), // Almacena la fecha en formato ISO
      activo: true,
      fecha_baja: null,
    });

    if (!usuarios) {
      error = new Error("No se pudo generar el usuario");
      throw error;
    }

    res.status(201).json(usuarios);
  } catch (err) {
    next(err);
  }
};

exports.updateUsuarioById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { nombre, apellido, direccion, usuario, email } = req.body;
    validarDireccion(direccion, false);
    validarUsuario(nombre, apellido, usuario, email);

    const usuarioExistente = await Usuario.findById(id);

    if (!usuarioExistente) {
      res
        .status(404)
        .json({ message: `No se encontró ningún usuario con el id ${id}` });
      return;
    }

    usuarioExistente.nombre = nombre || usuarioExistente.nombre;
    usuarioExistente.apellido = apellido || usuarioExistente.apellido;
    usuarioExistente.direccion = direccion || usuarioExistente.direccion;
    usuarioExistente.email = email || usuarioExistente.email;
    usuarioExistente.usuario = usuario || usuarioExistente.usuario;

    const usuarioActualizado = await usuarioExistente.save();

    res.status(200).json(usuarioActualizado);
  } catch (err) {
    next(err);
  }
};

exports.deleteUsuarioById = async (req, res, next) => {
  try {
    const id = req.params.id;

    usuarios = await Usuario.findByIdAndUpdate(
      id,
      {
        activo: false,
        fecha_baja: new Date().toLocaleDateString(),
      },
      { new: true }
    );
    if (!usuarios) {
      res
        .status(404)
        .json({ message: `No se encontró ningún usuario con el id ${id}` });
      return;
    }
    res.status(200).json(usuarios);
  } catch (err) {
    next(err);
  }
};

const validarEmail = (email) => {
  console.log(`El email es: ${email}`);
  const emailPartes = email.split("@");

  if (emailPartes.length !== 2) {
    let error = new Error(
      "El email debe tener un formato válido con un arroba seguido de al menos un punto."
    );
    error.status = 400;
    throw error;
  }

  const [username, dominio] = emailPartes;

  if (dominio.split(".").length < 2) {
    let error = new Error(
      "El email debe contener al menos un punto después del símbolo '@'."
    );
    error.status = 400;
    throw error;
  }
};


const validarDireccion = (direccion, aux) => {
  if (aux) {
    if (typeof direccion !== "object" || direccion === null) {
      error = new Error(
        "La direccion es un campo requerido y debe ser un objeto que contenga los atributos calle, altura, localidad y ciudad."
      );
      error.status = 400;
      throw error;
    }
    // Verificar que los atributos requeridos existen en la dirección
    const atributosRequeridos = ["calle", "altura", "localidad", "ciudad"];
    for (const atributo of atributosRequeridos) {
      if (!direccion.hasOwnProperty(atributo)) {
        error = new Error(
          `El atributo ${atributo} es requerido en la dirección.`
        );
        error.status = 400;
        throw error;
      }
    }
    if (
      !Number.isFinite(direccion.altura) ||
      direccion.altura < 1 ||
      direccion.altura.toString().trim().length > 6
    ) {
      error = new Error(
        "La altura es un campo requerido, debe ser un número mayor que 0 y con un máximo de 6 dígitos."
      );
      error.status = 400;
      throw error;
    }
  } else {
    if (typeof direccion !== "object") {
      error = new Error(
        "La direccion es un campo requerido y debe ser un objeto que contenga los atributos calle, altura, localidad y ciudad."
      );
      error.status = 400;
      throw error;
    }
    if (
      direccion.altura !== undefined &&
      direccion.altura.toString().trim().length > 0 &&
      (!Number.isFinite(direccion.altura) ||
        direccion.altura < 1 ||
        direccion.altura.toString().trim().length > 6)
    ) {
      error = new Error(
        "La altura debe ser un número mayor que 0 y con un máximo de 6 dígitos."
      );
      error.status = 400;
      throw error;
    }
  }

  // Resto de las validaciones
  if (!/^[a-zA-Z\sñÑ]+$/.test(direccion.calle)) {
    error = new Error(
      "La calle es un campo requerido, debe estar conformado solamente por letras."
    );
    error.status = 400;
    throw error;
  }

  if (!/^[a-zA-Z\sñÑ]+$/.test(direccion.localidad)) {
    error = new Error(
      "La localidad es un campo requerido, debe estar conformado solamente por letras."
    );
    error.status = 400;
    throw error;
  }
  if (!/^[a-zA-Z\sñÑ]+$/.test(direccion.ciudad)) {
    error = new Error(
      "La ciudad es un campo requerido, debe estar conformado solamente por letras."
    );
    error.status = 400;
    throw error;
  }
};

const validarFechaNacimiento = (fec_nac) => {
  if (!fec_nac) {
    error = new Error("La fecha de nacimiento es un campo requerido.");
    error.status = 400;
    throw error;
  }

  // Obtener el día, mes y año de la fecha
  const dateObject = new Date(fec_nac);

  // Validar que la fecha sea válida
  if (
    isNaN(dateObject.getTime()) || // Verificar si es una fecha válida
    dateObject > new Date() // Verificar que la fecha sea anterior a la actual
  ) {
    error = new Error("La fecha de nacimiento es inválida.");
    error.status = 400;
    throw error;
  }

  // Calcular la edad
  const age = new Date().getFullYear() - dateObject.getFullYear();

  // Comprobar si ya cumplió 18 años
  if (age < 18) {
    error = new Error("Debe ser mayor de 18 años.");
    error.status = 400;
    throw error;
  }
};

const validarUsuario = (...args) => {
  if (args.length === 5) {
    // Lógica para validar con 5 argumentos
    const [nombre, apellido, usuario, email, fec_nac] = args;
    if (
      !nombre ||
      !/^[a-zA-Z\sñÑ]+$/.test(nombre) ||
      nombre.trim().length < 1
    ) {
      error = new Error(
        "El nombre es un campo requerido, debe estar conformado solamente por letras."
      );
      error.status = 400;
      throw error;
    }
    if (
      !apellido ||
      !/^[a-zA-Z\sñÑ]+$/.test(apellido) ||
      apellido.trim().length < 1
    ) {
      error = new Error(
        "El apellido es un campo requerido, debe estar conformado solamente por letras."
      );
      error.status = 400;
      throw error;
    }
    if (
      !usuario ||
      !/^[a-zA-Z\sñÑ0-9]+$/.test(usuario) ||
      usuario.trim().length < 1
    ) {
      error = new Error(
        "El nombre de usuario es un campo requerido, debe estar conformado por letras y números."
      );
      error.status = 400;
      throw error;
    }
    if (!email) {
      error = new Error("El email es un campo requerido.");
      error.status = 400;
      throw error;
    } else {
      validarEmail(email);
    }
    validarFechaNacimiento(fec_nac);
  } else if (args.length === 4) {
    // Lógica para validar con 4 argumentos
    const [nombre, apellido, usuario, email] = args;
    if (nombre && !/^[a-zA-Z\sñÑ]+$/.test(nombre)) {
      error = new Error(
        "El nombre es un campo requerido, debe estar conformado solamente por letras."
      );
      error.status = 400;
      throw error;
    }
    if (apellido && !/^[a-zA-Z\sñÑ]+$/.test(apellido)) {
      error = new Error(
        "El apellido es un campo requerido, debe estar conformado solamente por letras."
      );
      error.status = 400;
      throw error;
    }
    if (usuario && !/^[a-zA-Z\sñÑ0-9]+$/.test(usuario)) {
      error = new Error(
        "El nombre de usuario es un campo requerido, debe estar conformado por letras y números."
      );
      error.status = 400;
      throw error;
    }
    if (email) {
      validarEmail(email);
    }
  } else {
    // Lanzar un error si la cantidad de argumentos no es la esperada
    throw new Error("Número incorrecto de argumentos para validarUsuario");
  }
};
