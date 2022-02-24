const Role = require("../models/role")
const Usuario = require("../models/usuario")

const esRolValido = async (rol = "") => {
    const existeRol = await Role.findOne({rol})
    if(!existeRol) {
        throw new Error("El rol no está registrado en la base de datos")
    }
}


const existeCorreo = async(correo = "") => {
    const correoIgual = await Usuario.findOne({ correo })
    if (correoIgual){
        throw new Error(`El correo ${ correo } ya está registrado`)
}
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario){
        throw new Error(`El id ${ id } no existe`)
}
}

module.exports = {
    esRolValido,
    existeCorreo,
    existeUsuarioPorId
}