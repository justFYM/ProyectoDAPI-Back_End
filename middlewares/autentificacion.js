const jwt = require('jsonwebtoken');
const verificarAuth = (req, res, next)=>{
/*verificarAuth tiene 3 parámetros: el primero es el requerimiento del usuario, el segundo es la respuesta y en éste
se ejecuta el middleware, por lo tanto la respuesta de abajo está comentanda porque con esa respuesta se 
comprueba si el middleware aparece cuando se intenta actualizar un usuario con el verbo PUT (con Postman).

    res.json({
        mensaje: 'Middleware ok'
    })
Entonces, cuando se quiere comprobar algo antes de que se ejecute el verbo, se hace en éste archivo.
Si la comprobación es correcta, entonces con next(); se procede a ejecutar el verbo.


*/
const token = req.get('token'); //Se crea el toquen leyendo el Header del Requerimiento del usuario, cuando envía su información desde el Front-End.
jwt.verify(token, 'secret', (err,decoded)=>{ //err se ejecuta cuando verify no se ejecuta.
    if(err){
        return res.status(400).json({ //status 500 se puede utilizar para errores en solicitudes http.
            mensaje: 'Usuario no valido',
            err
        })


    }

    req.usuario= decoded.data; //Cuando el middleware se verifica, se crea una variable en autentifación.js (req.usuario=decoded.data) contiene la información del usuario y como el modelo Nota tiene usuarioId, se le asocia a la nota el Id del usuario que corrsesponde. 

    next();
})
//console.log(token);


}

const verificarAdministrador = (req, res, next)=>{ //
    const rol = req.usuario.role;
    console.log(rol)
    if(rol==='ADMIN'){
    next();

    }else{
        return res.status(401).json({ //status 500 se puede utilizar para errores en solicitudes http.
            mensaje: 'Usuario no valido',
            
        })

    }

}



module.exports = {verificarAuth,verificarAdministrador}