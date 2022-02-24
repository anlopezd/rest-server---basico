const { Router } = require("express");
const { check } = require("express-validator");
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require("../controllers/usuarios");
const { esRolValido, existeCorreo, existeUsuarioPorId } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const router = Router();


router.get("/", usuariosGet);

router.put("/:id",
[
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRolValido),
    validarCampos
]
,usuariosPut);

router.post("/", [
check("nombre", "El nombre es obligatorio").not().isEmpty(),
check("password", "El password debe tener mas de 6 letras").isLength({min: 6}),
check("correo", "El correo no es válido").isEmail(),
// check("rol", "No es un rol permitido").isIn(["ADMIN_ROL", "USER_ROL"]),
check("rol").custom(esRolValido),
check("correo").custom(existeCorreo),
validarCampos
]
,usuariosPost);

router.delete("/:id",
[
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete);

router.patch("/", usuariosPatch)


module.exports = router