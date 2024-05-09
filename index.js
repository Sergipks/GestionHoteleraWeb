const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

// Enrutadores
const habitaciones = require(__dirname + '/routes/habitaciones');
const limpiezas = require(__dirname + '/routes/limpiezas');
const auth = require(__dirname + '/routes/auth');

dotenv.config();

// Conexión con la BD
mongoose.connect('mongodb://127.0.0.1:27017/hotel');

let app = express();

// Configuramos motor Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Asignación del motor de plantillas
app.set('view engine', 'njk');

// Middleware para peticiones POST y PUT
// Middleware para estilos Bootstrap
// Enrutadores para cada grupo de rutas
app.use(session({
  secret: '1234',
  resave: true,
  saveUninitialized: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: '1234',
  resave: true,
  saveUninitialized: false,
  expires: new Date(Date.now() + (30 * 60 * 1000))
}));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use('/habitaciones', habitaciones);
app.use('/limpiezas', limpiezas);
app.use('/auth', auth);

app.get('/', (req, res) => {
  res.redirect('/habitaciones');
});

// Puesta en marcha del servidor
app.listen(8080);