const { request, response } = require("express");
const { Producto } = require("../models")


const obtenerProductos = async(req = request, res = response) => {
    const {desde = 0, limite = 5} = req.query
    const query = {estado: true}

    const promesas = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate("usuario", "nombre")
        .populate("categoria", "nombre")
        .skip(desde)
        .limit(limite)
    ])

    const [total, productos] = promesas;

    res.status(200).json({
        total,
        productos
    })
}

const obtenerProductosPorId = async(req = request, res = response) => {

    const {id} = req.params;

    const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre")
    ;

    if(!producto.estado){
        return res.status(400).json({
            msg: "El producto tiene el estado en false"
        })
    }

    res.json(producto)


}

const crearProducto = async(req = request, res = response) => {
       
        const {estado, usuario, ...body} = req.body
    
        const productoDB = await Producto.findOne({nombre: body.nombre});

        if(productoDB){
            return res.status(400).json({
                msg: "Ya existe un producto con ese nombre"
            })
        }

        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario.id
        }

        const producto = new Producto(data)

        await producto.save()
    
            res.json(producto)
}

const actualizarProducto = async(req = request, res = response) => {
        const {id} = req.params;
        const {usuario, estado, ...data} = req.body;
        if(data.nombre){
            data.nombre = data.nombre.toUpperCase();
        }
        data.usuario = req.usuario.id;

        const producto = await Producto.findByIdAndUpdate(id, data, {new: true})

        res.status(201).json(producto)
}

const borrarProducto = async(req = request, res = response) => {
        const {id} = req.params;

        const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

        res.json(productoBorrado)

}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductosPorId,
    actualizarProducto,
    borrarProducto
}