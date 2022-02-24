const { Router } = require("express");
const {check} = require("express-validator")
const { loginPost, googleSignIn } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const router = Router();

router.post("/login", 
[
check("correo", "El correo es obligatorio").isEmail(),
check("password", "La contraseña es obligatoria").not().isEmpty(),
check("password", "La contraseña debe tener al menos 6 caracteres").isLength({min: 6}),
validarCampos
],
loginPost)

router.post("/google", [
    check("id_token", "El id_token es obligatorio").not().isEmpty(),
    validarCampos
],
googleSignIn
)

module.exports = router;