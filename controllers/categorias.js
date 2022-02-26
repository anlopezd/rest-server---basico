const { request, response } = require("express");
const { Categoria } = require("../models");

const getCategorias = async(req = request, res = response) => {
         
    const { limite = 5, desde = 0} = req.query;
    const query = {estado: true};
    const promesas = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate("usuario", "nombre")
        .skip(desde)
        .limit(limite)
    ])

    const [total, categorias] = promesas

            res.json({
                total,
                categorias
            })
}

const getCategoriaPorId = async(req = request, res = response) => {
  
    const {id}= req.params
    const categoria = await Categoria.findById(id).populate("usuario", "nombre");
  
    if (!categoria){
        return res.status(401).json({
            msg: "No se encontró una categoria con ese id"
        })
    }
    if(!categoria.estado){
        return res.status(401).json({
            msg: "La categoria tiene estado en false"
        })
    }

    res.json(categoria)
}

const crearCategoria = async(req = request, res = response) => {
  
  const nombre = req.body.nombre.toUpperCase()

  const categoriaDB = await Categoria.findOne({nombre})

  if(categoriaDB){
      return res.status(400).json({
          msg: `la categoria ${categoriaDB.nombre} ya existe`
      })
  }

  //Generar la data a guardar
  const data = {
      nombre,
      usuario: req.usuario._id
  }

  const categoria = new Categoria( data )
  await categoria.save()

    res.status(200).json(categoria)
}

const actualizarCategoria = async(req = request, res = response) => {
    
    const {id} = req.params 
    const {estado, usuario, ...data} = req.body
    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario.id
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true})
    if(!categoria) {
        return res.status(401).json({
            msg: "No existe categoria con esa id"
        })
    }    
    res.json(categoria)
}

const borrarCategoria = async(req = request, res = response) => {
   
    const {id} = req.params
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true})
   
    res.json(categoriaBorrada)
}

module.exports = {
    getCategorias,
    getCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}