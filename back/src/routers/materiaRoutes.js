import {Router} from 'express'
import { crearMateria, verMateria } from '../controllers/materiaController.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';
const router = Router()

router.post("/crear", verificarTokenJWT, crearMateria)

router.get("/ver/:id", verificarTokenJWT, verMateria)

export default router