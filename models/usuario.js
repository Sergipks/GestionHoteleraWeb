const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    login: {
        type: String,
        minlength: [5, "El nombre de usuario debe ser de mínimo 4 caracteres"],
        trim: true
    },
    password: {
        type: String,
        minlength: [8, "La contraseña del usuario debe ser de mínimo 8 caracteres"],
        trim: true
    }
});

const Usuario = mongoose.model('usuarios', usuarioSchema);

module.exports = Usuario;