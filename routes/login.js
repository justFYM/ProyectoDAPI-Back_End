import express from "express";
const router = express.Router();
const jwt = require('jsonwebtoken');


import User from "../models/user";
//Hash contraseña
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/login', async(req,res)=>{
    
    const body = req.body; //body es lo que enviará el usuario desde el Front-End.

    try {
        // Comprobando usuario
        const usuarioDB = await User.findOne({nombre: body.nombre})
        if(!usuarioDB){
            return res.status(400).json({ //status 500 se puede utilizar para errores en solicitudes http.
                mensaje: 'Nombre no encontrado',
            })
        }
        // Comprobando contraseña
        if(!bcrypt.compareSync(body.pass, usuarioDB.pass)){ //Devuelve un true o false. El primer parámetro es la contraseña que envía el usuario (requerimiento), el segundo es la contraseña que está en la bd, y se comparan.
            return res.status(400).json({
                mensaje: 'Contraseña no encontrada',
            })  
        }
        //Generar Token
        const token = jwt.sign({
            data: usuarioDB
          }, 'secret', { expiresIn: 60 * 60 * 24 * 30}); 


        res.json({
            usuarioDB,
            token: token
        })




    } catch (error) {
        return res.status(400).json({ //status 500 se puede utilizar para errores en solicitudes http.
            mensaje: 'Ocurrió un error',
            error
        })
        
    }

})
module.exports = router;