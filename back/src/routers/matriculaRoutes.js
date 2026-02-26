import { Router } from 'express';
import { crearMatricula, listarMatriculas, actualizarMatricula, eliminarMatricula } from '../controllers/matriculaController.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';

const router = Router();

router.post("/crear", verificarTokenJWT, crearMatricula);
router.get("/listar", verificarTokenJWT, listarMatriculas);
router.put("/actualizar/:id", verificarTokenJWT, actualizarMatricula);
router.delete("/eliminar/:id", verificarTokenJWT, eliminarMatricula);

export default router;