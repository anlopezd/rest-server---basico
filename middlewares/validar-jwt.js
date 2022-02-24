const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "No hay token en la peticion"
        })
    }

    try {

       const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid)

        if(!usuario) {
            return  res.status(401).json({
                msg: "Token no válido - usuario no existe en base de datos"
            })
        }

        //verificar que el usuario no está borrado
        if(!usuario.estado){
           return  res.status(401).json({
                msg: "Token no válido - usuario con estado en false"
            })
        }

        req.usuario = usuario

        
        next()
    } catch (error) {
        res.status(401).json({
            msg: "token no válido"
        })
    }

    
}


module.exports = {
    validarJWT
}