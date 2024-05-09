const express = require('express');

const auth = require(__dirname + '/../utils/auth.js');
const Habitacion = require(__dirname + '/../models/habitacion.js');
const Limpieza = require(__dirname + '/../models/limpieza.js');

const router = express.Router();

router.get('/:id', (req, res) => {
    Habitacion.findById(req.params.id).then(habitacion => {
        Limpieza.find({ habitacion: habitacion._id })
            .sort({ fecha: -1 }).then(limpiezas => {
                res.render('limpiezas_listado', { limpiezas: limpiezas, habitacion: habitacion});
            })
            .catch(error => {
                res.render('error', { error: "Error al obtener limpiezas" });
            });
        });
});

router.get('/nueva/:id', auth.autenticacion, (req, res) => {
    Habitacion.findById(req.params.id).then(resultado => {
        res.render('limpiezas_nueva', { habitacion: resultado });
    });
});

router.post('/:id', auth.autenticacion, (req, res) => {
    const nuevaLimpieza = new Limpieza({
        habitacion: req.params.id,
        fecha: req.body.fecha,
        observaciones: req.body.observaciones
    });

    nuevaLimpieza.save().then(resultado => {
        Habitacion.findByIdAndUpdate(
            { _id: nuevaLimpieza.habitacion },
            { $set: { ultimaLimpieza: nuevaLimpieza.fecha } }, 
            { new: true }
        ).then(resultado => {
            if (!resultado) {
                return res.render('error', { error: "No se ha encontrado la habitación"});
            }
        });

        res.redirect(req.baseUrl+'/'+req.params.id);
    })
    .catch(error => {
        res.render('error', { error: "No se ha podido insertar la limpieza" });
    });
});

module.exports = router;