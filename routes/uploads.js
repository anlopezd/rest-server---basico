const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchivo, actualizarImagen, obtenerArchivo, actualizarImagenCloudinary } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares");
const { validarArchivos } = require("../middlewares/validar-archivos");
const router = Router();


router.get("/:coleccion/:id", obtenerArchivo)


router.post("/", validarArchivos ,cargarArchivo)

router.put("/:coleccion/:id",[
    validarArchivos,
    check("id", "el id debe ser de mongo").isMongoId(),
    check("coleccion").custom(c => coleccionesPermitidas(c, ["usuarios", "productos"])),
    validarCampos
] ,actualizarImagenCloudinary)


module.exports = router;