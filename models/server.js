const express = require("express")
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        //rutas disponibles
        this.usuariosPath = "/api/usuarios"
        this.authPath = "/api/auth"
        this.categorias = "/api/categorias"
        this.productosPath = "/api/productos"
        this.buscarPath = "/api/buscar"
        this.uploadsPath = "/api/uploads"
        //Conectar a base de datos
        this.conectarDB()
        //middlewares
        this.middlewares()
        //rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }


    middlewares(){
         // carga de archivos  express-fileupload
         this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }))
        //CORS
        this.app.use( cors() )
        //parseo y lectura del body
        this.app.use(express.json())
        //directorio publico
        this.app.use(express.static("public"))
       
    }


    routes(){
        this.app.use(this.authPath, require("../routes/auth"))
        this.app.use(this.usuariosPath, require("../routes/usuarios"))
        this.app.use(this.categorias, require("../routes/categorias"))
        this.app.use(this.productosPath, require("../routes/productos"))
        this.app.use(this.buscarPath, require("../routes/buscar"))
        this.app.use(this.uploadsPath, require("../routes/uploads"))

    };

    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en el puerto: ", this.port)
        })
    }


}

module.exports = Server