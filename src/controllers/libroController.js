const Libro = require("../models/libroModel");

exports.getAllLibros = async (req, res, next) => {
  try {
    const libros = await Libro.find({ activo: true });
    if (libros.length === 0) {
      let error = new Error("No se pudieron obtener los libros");
      throw error;
    }
    res.status(200).json(libros);
  } catch (err) {
    next(err);
  }
};

exports.getLibroById = async (req, res, next) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) {
      let error = new Error(`No existe ningun libro asociado al id ${id}`);
      error.status = 400;
      throw error;
    }
    res.status(200).json(libro);
  } catch (error) {
    next(err);
  }
};

exports.createLibro = async (req, res, next) => {
  try {
    const { titulo, autor } = req.body;
    validarLibro(titulo, autor);

    let codigo = await Libro.find({}).count();

    const nuevoLibro = await Libro.create({
      codigo: codigo,
      titulo: titulo,
      autor: autor,
      activo: true,
    });
    if (!nuevoLibro) {
      let error = new Error("No se pudo cargar el libro");
      throw error;
    }
    res.status(201).json(nuevoLibro);
  } catch (err) {
    next(err);
  }
};

exports.updateLibro = async (req, res, next) => {
  try {
    const { titulo, autor } = req.body;

    validarLibro(titulo, autor);

    const libro = await Libro.findByIdAndUpdate(
      req.params.id,
      { titulo: titulo, autor: autor },
      {
        new: true,
      }
    );

    if (!libro) {
      let error = new Error(`No existe ningun usuario asociado al id ${id}`);
      error.status = 400;
      throw error;
    }

    res.status(200).json(libro);
  } catch (err) {
    next(err);
  }
};

exports.deleteLibro = async (req, res, next) => {
  try {
    validarId(req.params.id);
    const libroEliminado = await Libro.findByIdAndUpdate(
      req.params.id,
      {
        activo: false,
      },
      { new: true }
    );

    if (!libroEliminado) {
      let error = new Error(`No existe ningun usuario asociado al id ${id}`);
      error.status = 400;
      throw error;
    }
    res.status(200).json(libroEliminado);
  } catch (err) {
    next(err);
  }
};

let validarLibro = (titulo, autor) => {
  if (!/^[a-zA-ZñÑ\s]+$/.test(titulo) || titulo.trim().length < 1) {
    let error = new Error(
      "El titulo es campo requerido y debe estar conformado por letras"
    );
    error.status = 400;
    throw error;
  }

  if (!/^[a-zA-ZñÑ\s]+$/.test(autor) || autor.trim().length < 1) {
    let error = new Error(
      "El autor es campo requerido y debe estar conformado por letras"
    );
    error.status = 400;
    throw error;
  }
};

let validarId = (id)=>{
  if(!/^[a-fA-F0-9]+$/.test(id) || id.trim().length !== 24){
    let error = new Error(
      "El id es campo requerido y debe estar conformado por 24 caracteres hexadecimales"
    );
    error.status = 400;
    throw error;
  }
};