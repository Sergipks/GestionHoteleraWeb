const express = require('express');

const router = express.Router();
const Usuario = require('../models/usuario');

router.get('/login', (req, res) => {
    res.render('login');
});

// Loguear a un usuario
router.post('/login', (req, res) => {
    const { login, password } = req.body;

    Usuario.findOne({ login: login })
    .then(usuario => {
        if(!usuario || (usuario.password != password)){
            res.render('login', {error: "Usuario o contraseña incorrectos"});
        } else {
            req.session.usuario = usuario.login;
            res.redirect('/habitaciones');
        }
    })
    .catch(error => {
        res.render('error', { error: "Error interno del servidor" });
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
