import express from 'express';
const router = express.Router();

// importar el modelo nota
import Nota from '../models/nota';

const {verificarAuth, verificarAdministrador} = require('../middlewares/autentificacion')

// Agregar una nota (post)
router.post('/nueva-nota',verificarAuth, async(req, res) => { //Se agrega el middleware verificar Auth. Cuando el middleware se verifica, se crea una variable en autentifación.js (req.usuario=decoded.data) contiene la información del usuario y como el modelo Nota tiene usuarioId, se le asocia a la nota el Id del usuario que corresponde. 
  const body = req.body;  

  body.usuarioId = req.usuario._id; //Se le asigna a la nota, la id del usuario con req.usuario(variable creada en autentificacion.js, es cuando se decodifica el token y se obtienen los datos del usuario. )

  try {
    const notaDB = await Nota.create(body);
    res.status(200).json(notaDB); //colocar .status(200) no es requerido, puesto que express ya lo tiene por defecto me parece.
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Get con parámetros
router.get('/nota/:id', async(req, res) => {
  const _id = req.params.id; //req.params.id obtiene la id luego del :
  try {
    const notaDB = await Nota.findOne({_id});
    res.json(notaDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

//Get con cada documento que tiene el usuario.
router.get('/nota',verificarAuth, async(req, res) => {
  const usuarioId = req.usuario._id //Se obtiene la Id del usuario del token, para más abajo realizar la búsqueda de las notas asociadas a la id del usuario en la base de datos. (req.usuario es la respuesta que arroja el sistema cuando se verifica el token en autentificacion.js)
  try {
    const notaDb = await Nota.find({usuarioId}); //Se busca en la base de datos, las Nota asociadas solo al id del usuario que trae el token.
    res.json(notaDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

//Delete, eliminar un documento.
router.delete('/nota/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const notaDb = await Nota.findByIdAndDelete({_id});
    if(!notaDb){
      return res.status(400).json({
        mensaje: 'No se encontró el id indicado',
        error
      })
    }
    res.json(notaDb);  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

//Put - Actualizar una nota.
router.put('/nota/:id', async(req, res) => {
  const _id = req.params.id;
  const body = req.body;
  try {
    const notaDb = await Nota.findByIdAndUpdate(
      _id,
      body,
      {new: true});
    res.json(notaDb);  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

//Se exporta router para que lo pueda ocupar app.js
module.exports = router;