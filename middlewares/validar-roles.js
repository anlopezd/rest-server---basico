const { request, response } = require("express")


const esAdminRol = (req = request, res = response, next) => {

    if(!req.usuario) {
        return res.status(500).json({
            msg: "Se quiere verificar el rol sin validar el token"
        })
    }

    const { rol, nombre } = req.usuario

    if (rol !== "ADMIN_ROL"){
        return res.status(400).json({
            msg: `${nombre} no es administrador - no puede hacer esto`
        })
    }

    next()
}

const tieneRol = ( ...roles ) => {

    return (req = request, res = response, next) => {
        console.log(roles)

        if(!req.usuario) {
            return res.status(500).json({
                msg: "Se quiere verificar el rol sin validar el token"
            })
        }

        if(!roles.includes(req.usuario.rol)) {
            return res.status(500).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }


        next()
    }


}

module.exports = {
    esAdminRol,
    tieneRol
}

