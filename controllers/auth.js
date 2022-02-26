const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require("../models/usuario");

const loginPost = async (req = request, res = response) => {
       
    const {correo, password} = req.body

    try {
        // verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        if(!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - correo"
            })
        }
        // verificar si el usuarios está activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - estado: false"
            })
        }
        // verificar la contraseña

        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - Password"
            })
        }

        // verificar el JWT
        const token = await generarJWT( usuario.id )

         res.json({
           usuario,
           token
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Algo salió mal"
        })
    }
    
}

const googleSignIn = async(req = request, res = response) => {
    const {id_token} = req.body 

    try {
        const { nombre, imagen, correo } = await googleVerify(id_token)
        // ver si el correo ya existe en base de datos
        let usuario = await Usuario.findOne({correo})
        if(!usuario) {
            const data = {
                nombre,
                correo,
                imagen,
                password: "123456",
                google: true,
                rol: "ADMIN_ROL"
            }

            usuario = new Usuario(data)
            await usuario.save();
        }

        // si el usuario tiene el estado en false
        if (!usuario.estado){
            return res.status(401).json({
                msg: "Hable con el administrados usuario bloqueado"
            })
        }
        // generar JWT
        const token = await generarJWT(usuario.id)

        res.json({
        usuario,
        token
        })
    } catch (error) {
        res.status(400).json({
            msg: "el token no se pudo verificar"
        })
    }
    
}



module.exports = {
    loginPost,
    googleSignIn
}
