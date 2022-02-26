const path = require("path")
const fs = require("fs")

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
const { request, response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");

const obtenerArchivo = async(req = request, res = response) => {

    const {coleccion, id } = req.params
    
    let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({ msg: "no existe usuario con ese id" });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({ msg: "no existe producto con ese id" });
      }
      break;

    default:
      res.status(500).json({ msg: "se me olvido subir esto" });
  }


  if(modelo.img){
    // borrar imagen del servidor
    const pathImage = path.join(__dirname, "../uploads", coleccion, modelo.img)
        if( fs.existsSync(pathImage)){
           return res.sendFile(pathImage)
        }

}


    const noImage = path.join(__dirname, "../assets", "no-image.jpg")
    
    res.sendFile(noImage)



}


const cargarArchivo = async (req = request, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, undefined, "img");
    res.json({
      nombre,
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const actualizarImagen = async (req = request, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({ msg: "no existe usuario con ese id" });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({ msg: "no existe producto con ese id" });
      }
      break;

    default:
      res.status(500).json({ msg: "se me olvido subir esto" });
  }

  // limpiar imagenes previas
  if(modelo.img){
        // borrar imagen del servidor
        const pathImage = path.join(__dirname, "../uploads", coleccion, modelo.img)
            if( fs.existsSync(pathImage)){
                fs.unlinkSync(pathImage)
            }

  }



  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
};

const actualizarImagenCloudinary = async (req = request, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({ msg: "no existe usuario con ese id" });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({ msg: "no existe producto con ese id" });
      }
      break;

    default:
      res.status(500).json({ msg: "se me olvido subir esto" });
  }

  // limpiar imagenes previas
  if(modelo.img){
        // borrar imagen del servidor
        const nombreArr = modelo.img.split("/")
        const nombre = nombreArr[nombreArr.length - 1]
        const [public_id] = nombre.split(".")
        console.log(public_id)
        await cloudinary.uploader.destroy(public_id)
  }

  const { tempFilePath } = req.files.archivo

  const {secure_url}= await cloudinary.uploader.upload(tempFilePath)

  // const nombre = await subirArchivo(req.files, undefined, coleccion);
   modelo.img = secure_url

  await modelo.save();

  res.json(modelo);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  obtenerArchivo,
  actualizarImagenCloudinary
};

