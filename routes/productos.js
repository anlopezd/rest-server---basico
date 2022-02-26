const { Router } = require("express")
const { check } = require("express-validator");
const { crearProducto, obtenerProductos, obtenerProductosPorId, actualizarProducto, borrarProducto  } = require("../controllers/productos");
const { existeProductoPorId, existeCategoriaPorId } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRol } = require("../middlewares");

const router = Router();

router.get("/", obtenerProductos);

router.get("/:id",
[
    check("id", "el id es obligatorio").not().isEmpty(), 
    check("id", "el id debe ser un mongo id").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos
]
,obtenerProductosPorId)


router.post("/",
[
    validarJWT,
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("categoria", "no es un id de mongo").isMongoId(),
    check("categoria").custom( existeCategoriaPorId ),
    validarCampos
]
,crearProducto)

router.put("/:id", 
[
    validarJWT,
    check("id", "Debe tener un mongo id").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos
]
,actualizarProducto)

router.delete("/:id",[
    validarJWT,
    esAdminRol,
    check("id", "No es una id de mongo").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos
] ,borrarProducto)

module.exports = router;