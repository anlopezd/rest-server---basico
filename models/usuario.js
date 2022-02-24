
const { Schema, model } = require("mongoose")

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    correo: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    imagen: {
        type: String,
    },
    rol: {
        type: String,
        required: [true, "El rol es obligatorio"],
        enum: ["ADMIN_ROL", "USER_ROL"]
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
})

UsuarioSchema.methods.toJSON = function(){
    const { __v, password, ...usuario } = this.toObject()
    return usuario
}


module.exports = model("Usuario", UsuarioSchema)