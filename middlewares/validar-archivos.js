const { response } = require("express");
const { request } = require("express");



const validarArchivos = (req = request, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({ msg: "no hay archivos en la peticion" });
        return;
      }

    next()
}


module.exports = {
    validarArchivos
}