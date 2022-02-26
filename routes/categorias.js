const { Router } = require("express");
const { check } = require("express-validator");
const { getCategorias, getCategoriaPorId, crearCategoria, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");
const { esAdminRol } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos")
const { validarJWT } = require("../middlewares/validar-jwt")

const router = Router();


//Obtener todas las categorias - publico
router.get("/", getCategorias) 

//Obtener solamente una categoria - publico
router.get("/:id", 
[
    check("id", "No es una id de mongo").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos
]  

,getCategoriaPorId) 

//Crear categoria - privado - cualquier persona con token valido
router.post("/", 
[
    validarJWT,
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    validarCampos
]
,crearCategoria) 

//Actualizar - privado - cualquiera con token
router.put("/:id", 
[
    validarJWT,
    check("id", "Debe tener un mongo id").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    validarCampos
]
,actualizarCategoria)

//Borrar una categoria por el id - privado - cualquiera con token
router.delete("/:id",[
    validarJWT,
    esAdminRol,
    check("id", "No es una id de mongo").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos
] ,borrarCategoria)



module.exports = router  