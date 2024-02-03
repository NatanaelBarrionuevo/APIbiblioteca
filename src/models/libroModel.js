const mongoose = require('mongoose');


const LibroSchema = new mongoose.Schema({
  codigo: {type: Number, required: true},
  titulo: {type: String, required: true},
  autor: {type: String, required: true},
  activo: {type: Boolean, required: true},
}, { collection: 'libros' });

const Libro = mongoose.model('Libro', LibroSchema);

module.exports = Libro;