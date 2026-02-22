import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import Materia from "../models/Materia.js";

/**
 * Crear token JWT
 * @param {string} id - ID del usuario
 * @param {string} rol - Rol del usuario
 * @returns {string} token - JWT
 */
const crearTokenJWT = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const verificarTokenJWT = async (req, res, next) => {

    const {autorization} = req.headers
    if(!autorization) return res.status(401).json({msg:"No hay token, acceso no autorizado"})
    try{
        const token = autorization.split(" ")[1]
        const {id,rol} = jwt.verify(token, process.env.JWT_SECRET)

        // Verificar que el usuario exista
        if(rol === "usuario"){
            const usuarioBDD = await Usuario.findById(id).lean().select("-password")
            if(!usuarioBDD) return res.status(404).json({msg:"El usuario no existe"})
            req.usuario = usuarioBDD
            return next()
        }
    } catch (error){  
        console.error(error)
        return res.status(401).json({msg:`Token no válido o expirado- ${error}`})
    }
}

export {
    crearTokenJWT,
    verificarTokenJWT
}