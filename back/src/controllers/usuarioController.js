import Usuario from "../models/Usuario.js";
import mongoose from "mongoose";

const crearUsuario = async (req, res) => {
    try {
        const {email} = req.body
        const existeUsuario = await Usuario.findOne({email})
        if(existeUsuario) return res.status(400).json({msg:"El usuario ya existe"})
        const usuario = new Usuario(req.body)
        usuario.password = await usuario.encryptPassword(usuario.password)
        const usuarioBDD = await usuario.save()
        res.status(201).json({msg:"Usuario creado correctamente", usuario:usuarioBDD})
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const comprobarTokenPassword = async (req, res) => {
    try {
        // Paso 1
        const {token} = req.params
        // Paso 2
        const usuarioBDD = await Usuario.findOne({token})
        if(usuarioBDD?.token !== token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        // Paso 3
        // veterinarioBDD?.token = null
        // Paso 4 - Mostrar mensaje de respuesta
        res.status(200).json({msg:"Token confirmado"}) 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const Login = async (req, res) => {
    try {
        const {email, password} = req.body
        const usuarioBDD = await Usuario.findOne({email})
        if(!usuarioBDD) return res.status(404).json({msg:"Usuario o contraseña incorrectos"})
        const passwordCorrecto = await usuarioBDD.matchPassword(password)   
        if(!passwordCorrecto) return res.status(404).json({msg:"Usuario o contraseña incorrectos"})
        const tokenGenerado = usuarioBDD.createToken()
        await usuarioBDD.save()
        res.status(200).json({msg:"Login correcto", token:tokenGenerado})
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

export {
    crearUsuario,
    comprobarTokenPassword,
    Login
}