const express = require('express');

const upload = require(__dirname + '/../utils/uploads.js');
const auth = require(__dirname + '/../utils/auth.js');
const Habitacion = require(__dirname + '/../models/habitacion.js');
const Limpieza = require(__dirname + '/../models/limpieza.js');

const router = express.Router();

router.get('/', (req, res) => {
    Habitacion.find().then(resultado => {
        res.render('habitaciones_listado', {habitaciones: resultado});
    }).catch (error => {
        res.render('error', {error: "Error al conectar con el servidor"});
    });
});

router.get('/nueva', auth.autenticacion, (req, res) => {
    res.render('habitaciones_nueva');
});

router.get('/:id', (req, res) => {
    Habitacion.findById(req.params.id).then(resultado => {
        if(resultado)
            res.render('habitaciones_ficha', { habitacion: resultado});
        else
        res.render('error', {error: "No existe el número de habitación"});
    }).catch (error => {
        res.render('error', {error: "Error al conectar con el servidor"});
    });
});

router.post('/', auth.autenticacion, upload.uploadHabitacion.single('imagen'), (req, res) => {
    let nuevaHabitacion = new Habitacion({
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        precio: req.body.precio
    });
    if (req.file)
        nuevaHabitacion.imagen = req.file.filename;

    nuevaHabitacion.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        let errores = {
            general: 'Error insertando habitación'
        };
        if(error.errors.numero)
        {
            errores.numero = error.errors.numero.message;
        }
        if(error.errors.precio)
        {
            errores.precio = error.errors.precio.message;
        }
        if(error.errors.descripcion)
        {
            errores.descripcion = error.errors.descripcion.message;
        }

        res.render('habitaciones_nueva', {errores: errores, datos: req.body});
    });
});

router.put('/:id', (req, res) => {
    Habitacion.findByIdAndUpdate(req.params.id, {
        $set: {
            numero: req.body.numero,
            tipo: req.body.tipo,
            descripcion: req.body.descripcion,
            ultimaLimpieza: req.body.ultimaLimpieza,
            precio: req.body.precio
        }
    }, {new: true}).then(resultado => {
        res.status(200)
        .send({
                ok: true, 
                resultado: resultado});
    }).catch(error => {
        res.status(400)
           .send({
                ok: false, 
                error:"Error actualizando los datos de la habitación"});
    });
});

router.delete('/:id', auth.autenticacion, (req, res) => {
    Habitacion.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch (error => {
        res.render('error', { error: "Error al borrar la habitación"});
    });
});

router.post('/:id/incidencias', auth.autenticacion, upload.uploadIncidencia.single('imagen'), (req, res) => {
    Habitacion.findById(req.params.id).then(resultado => {
        let nuevaIncidencia = {
            descripcion: req.body.descripcion,
            imagen: req.file.filename
        };

        resultado.incidencias.push(nuevaIncidencia);

        resultado.save().then(resultadoNuevo => {
            res.redirect(req.baseUrl+'/'+req.params.id);
        }).catch (e => {
            console.log(e);
            res.render('error', { error: "Error añadiendo la incidencia" });
        })
    }).catch(error => {
        res.render('error', { error: "No existe la habitación referenciada" });
    });
});

router.put('/:idHab/incidencias/:idInc', auth.autenticacion, (req, res) => {
    Habitacion.findById(req.params.idHab).then(resultado => {
        resultado.incidencias.forEach(incidencia => {
            if(incidencia._id == req.params.idInc){
                incidencia.fin = Date.now();
                resultado.save();
                incidenciaEncontrada = true;
            }
        });

        res.redirect(req.baseUrl+'/'+req.params.idHab);
    }).catch(error => {
        res.render('error', { error: "No existe el número de habitación" });
    });
});

module.exports = router;