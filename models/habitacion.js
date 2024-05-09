const mongoose = require('mongoose');

const incidenciaSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: [true, "La descripción de la incidencia es obligatoria"]
    },
    inicio: {
        type: Date,
        required: [true, "La fecha de inicio de la incidencia es obligatoria"],
        default: Date.now
    },
    fin: {
        type: Date
    },
    imagen: {
        type: String
    }
});

const habitacionSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: [true, "El número de la habitación es obligatorio"],
        min: [1, "El número de la habitación debe ser mayor que 0"],
        max: [50, "El número de la habitación debe ser menor que 51"]
    },
    tipo: {
        type: String,
        enum: ["individual", "doble", "familiar", "suite"],
        default: "individual"
    },
    descripcion: {
        type: String,
        required: [true, "La descripción de la habitación es obligatoria"],
        trim: true
    },
    ultimaLimpieza: {
        type: Date,
        required: [true, "La última limpieza de la habitación es obligatoria"],
        default: Date.now
    },
    precio: {
        type: Number,
        required: [true, "El precio de la habitación es obligatorio"],
        min: [0, "El precio de la habitación debe ser positivo"],
        max: [300, "El precio de la habitación no debe exceder los 300€"]
    },
    incidencias: [incidenciaSchema],
    imagen: {
        type: String
    }
});

const Habitacion = mongoose.model('habitaciones', habitacionSchema);

module.exports = Habitacion;