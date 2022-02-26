const Role = require("../models/role")
const Usuario = require("../models/usuario")
const Categoria = require("../models/categoria")
const Producto = require("../models/producto")
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

const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria){
        throw new Error(`El id ${ id } no existe`)
}
}

const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id)
    if (!existeProducto){
        throw new Error(`El id ${ id } no existe`)
}
}

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  
    if(!colecciones.includes(coleccion)){
        throw new Error("No es una coleccion permitida")
    }

    return true
}

module.exports = {
    esRolValido,
    existeCorreo,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}