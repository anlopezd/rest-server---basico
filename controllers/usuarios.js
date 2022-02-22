const { response, request } = require("express")

const usuariosGet = (req = request, res = response ) => {
    
    const query = req.query
    
    res.json({
        msg: "get api - controlador",
        query
    })
}

const usuariosPut = (req, res = response) => {

    const {id} = req.params

    res.json({
        msg: "put api - controlador",
        id
    })
}

const usuariosPost = (req, res = response) => {

    const {nombre, edad} = req.body

    res.json({
        msg: "post api",
        nombre,
        edad
    })
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: "delete api"
    })
}

const usuariosPatch = (req, res) => {
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