import Matricula from "../models/Matricula.js";
import Estudiante from "../models/Estudiante.js";
import Materia from "../models/Materia.js";
import mongoose from "mongoose";

// 1. CREAR (Create)
const crearMatricula = async (req, res) => {
    try {
        const { codigo, estudiante, materia } = req.body;

        // Validar que no existan campos vacíos
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" });
        }

        // Validar que el código de la matrícula no exista previamente
        const existeMatricula = await Matricula.findOne({ codigo });
        if (existeMatricula) return res.status(400).json({ msg: "El código de matrícula ya existe" });

        // Validar que los IDs tengan un formato válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(estudiante) || !mongoose.Types.ObjectId.isValid(materia)) {
            return res.status(400).json({ msg: "ID de estudiante o materia no válido" });
        }

        // VALIDACIÓN CLAVE: Confirmar que el estudiante y la materia realmente existan en la Base de Datos
        const existeEstudiante = await Estudiante.findById(estudiante);
        const existeMateria = await Materia.findById(materia);

        if (!existeEstudiante) return res.status(404).json({ msg: "El estudiante no existe en la base de datos" });
        if (!existeMateria) return res.status(404).json({ msg: "La materia no existe en la base de datos" });

        // Guardar la matrícula
        const nuevaMatricula = new Matricula(req.body);
        const matriculaBDD = await nuevaMatricula.save();

        res.status(201).json({ msg: "Matrícula creada correctamente", matricula: matriculaBDD });

    } catch (error) {
        res.status(500).json({ msg: "Error al crear la matrícula", error: error.message });
    }
}

// 2. LEER (Read)
const listarMatriculas = async (req, res) => {
    try {
        // El método .populate() es esencial aquí para traer los datos del estudiante y materia asociados
        const matriculas = await Matricula.find()
            .populate("estudiante", "nombre apellido cedula")
            .populate("materia", "nombre codigo creditos");
            
        res.status(200).json(matriculas);
    } catch (error) {
        res.status(500).json({ msg: "Error al listar las matrículas", error: error.message });
    }
}

// 3. ACTUALIZAR (Update)
const actualizarMatricula = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID de matrícula no válido" });

        const matriculaBDD = await Matricula.findById(id);
        if (!matriculaBDD) return res.status(404).json({ msg: "Matrícula no encontrada" });

        // Si están intentando actualizar el estudiante o la materia, debemos validar que existan
        if (req.body.estudiante) {
            const existeEstudiante = await Estudiante.findById(req.body.estudiante);
            if (!existeEstudiante) return res.status(404).json({ msg: "El nuevo estudiante asignado no existe" });
        }

        if (req.body.materia) {
            const existeMateria = await Materia.findById(req.body.materia);
            if (!existeMateria) return res.status(404).json({ msg: "La nueva materia asignada no existe" });
        }

        const matriculaActualizada = await Matricula.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ msg: "Matrícula actualizada correctamente", matricula: matriculaActualizada });

    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar la matrícula", error: error.message });
    }
}

// 4. ELIMINAR (Delete)
const eliminarMatricula = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID de matrícula no válido" });

        const matriculaBDD = await Matricula.findById(id);
        if (!matriculaBDD) return res.status(404).json({ msg: "Matrícula no encontrada" });

        await Matricula.findByIdAndDelete(id);
        res.status(200).json({ msg: "Matrícula eliminada correctamente" });

    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar la matrícula", error: error.message });
    }
}

export {
    crearMatricula,
    listarMatriculas,
    actualizarMatricula,
    eliminarMatricula
}