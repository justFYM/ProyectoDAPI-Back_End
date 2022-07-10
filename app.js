import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { get } from 'underscore';

const app = express();
// Conexión base de datos
const mongoose = require('mongoose');

const uri = 'mongodb://0.0.0.0:27017/back_end'; //Luego de una actualización en node, se requiere colocar 0.0.0.0 en vez de localhost
const options = {useNewUrlParser: true, useUnifiedTopology: true};

//Conexión en la nube
//const uri = 'mongodb+srv://fernando_user:ABJqY8YM5wQL4t0i@fernando.g7b8z.mongodb.net/?retryWrites=true&w=majority'; 

// Or using promises
mongoose.connect(uri, options).then(
  /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
  () => { console.log('Conectado a DB probando') },
  /** handle initial connection error */
  err => { console.log(err) }
  );



// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// Rutas
/*
app.get('/', (req, res) => {
  res.send('Hello World!');
});
*/

app.use('/api', require('./routes/login')); // Se crea la ruta /login y requiere el archivo login


app.use('/api', require('./routes/nota')); // Se crea la ruta /api/(depende de la solicitud) /nota, nueva-nota, nota/:id
app.use('/api', require('./routes/user'));  // Se crea la ruta /api/(depende de la solicitud) /usuario/:id, /nuevo-usuario
app.use('/api', require('./routes/userData'));  // Se crea la ruta /api/a (contiene la API que otorgó el profesor)

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), () => {
  console.log('Example app listening on port'+ app.get('puerto'));
});
