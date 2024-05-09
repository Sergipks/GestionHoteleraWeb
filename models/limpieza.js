const mongoose = require('mongoose');

const limpiezaSchema = mongoose.Schema({
    habitacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'habitaciones'
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    observaciones: {
        type: String
    }
});

const Limpieza = mongoose.model('limpiezas', limpiezaSchema);

module.exports = Limpieza;