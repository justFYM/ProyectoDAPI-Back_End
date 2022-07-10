import express from "express";
const router = express.Router();
import User from "../models/user";

const {verificarAuth,verificarAdministrador} = require('../middlewares/autentificacion');


//Hash contraseña
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Filtrar campos de PUT
const _ = require('underscore');

//Post
router.post('/nuevo-usuario',async(req,res)=>{  //primer parámetro es el nombre de la ruta, el segundo es el requerimiento y respuesta.
    const body = { //Almacena el requerimiento del body, aún no está la respuesta
        nombre: req.body.nombre,
        role: req.body.role
    } 
    body.pass = bcrypt.hashSync(req.body.pass, saltRounds);

    try {
    const usuarioDB= await User.create(body) //Si el req se hizo, se crea un Usuario con el schema User luego de escribir await y se le pasa el body del requerimiento (ya que éste contiene los atributos del Usuario).
    res.json(usuarioDB) //Se envía la respuesta del await al front-end
        
    } catch (error) {
        return res.status(500).json({ //status 500 se puede utilizar para errores en solicitudes http.
            mensaje: 'Ocurrió un error',
            error
        })
        
    }


})
//Put
router.put('/usuario/:id', [verificarAuth,verificarAdministrador], async(req,res)=>{
    const _id=req.params.id;  //Params se utiliza para obtener el id luego de los : en la ruta.
    const body = _.pick(req.body, ['nombre','pass','activo']) //Se hace el requerimiento (lo que se quiere que contenga la respuesta)
    if(body.pass){ //Si ya existe el body.pass, entonces se vuelve a encriptar la contraseña cuando se modifica.
        body.pass = bcrypt.hashSync(req.body.pass, saltRounds);

    }



    try {
        const usuarioDB = await User.findByIdAndUpdate(_id, body, {new: true, runValidators: true}) //El new: true devuelve el usuario actualizado cuando se usa el verbo Get. runValidator verifica que los roles que digite el usuario, sean los que están disponibles (los que se pusieron en el array roles en models user.js).
        return res.json(usuarioDB);
        
    } catch (error) {
        return res.status(400).json({ //status 500 se puede utilizar para errores en solicitudes http.
            mensaje: 'Ocurrió un error',
            error
        })
        
    }




})



module.exports = router; //Se exporta el router que contiene la ruta para los usuarios.