const { response, request } = require("express")
const Usuario = require("../models/usuario")
const bcryptjs = require("bcryptjs")


const usuariosGet = async(req = request, res = response ) => {

    //obtener usuarios  
    const {limite = 15, desde = 0} = req.query
  
    const respuestas = await Promise.all([
        Usuario.countDocuments({estado: true}), //Se filtra por medio del estado
        Usuario.find({estado: true})
        .skip(desde)
        .limit(limite)
       ])

     const [total, usuarios] = respuestas  
   
    res.json({
       total,
       usuarios
    })
}

const usuariosPut = async (req = request, res = response) => {

    const {id} = req.params
    const { _id ,password, google, correo, ...resto } = req.body

    //Validar el id en la base de datos
    if(password) {
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        msg: "put api - controlador",
        usuario
    })
}

const usuariosPost = async(req = request, res = response) => {

    const {nombre, correo, password, rol} = req.body
    const usuario = new Usuario({ nombre, correo, password, rol})
    
    //encriptar contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)
    //guardar base de datos
    await usuario.save()    

    res.json({
        usuario
    })
}

const usuariosDelete = async(req = request, res = response) => {
    
   const {id} = req.params
   //Asi se borra fisicamente
   // const usuarioBorrado = await Usuario.findByIdAndDelete(id)

   const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json({
       usuario
    })
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: "patch controlador"
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}