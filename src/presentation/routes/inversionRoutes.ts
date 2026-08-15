import { Router } from 'express';
import { InversionController } from '../controllers/InversionController';
import { validate } from '../middlewares/validate';
import {
  crearInversionSchema,
  simularInversionSchema,
} from '../../application/dto/InversionDto';

export function createInversionRouter(controller: InversionController): Router {
  const router = Router();

  router.post('/simular', validate(simularInversionSchema), controller.simular);
  router.post('/', validate(crearInversionSchema), controller.crear);
  router.get('/', controller.listar);
  // Debe ir antes de /:id para no capturar "usuario" como id
  router.get('/usuario/:id', controller.listarPorUsuario);
  router.get('/:id', controller.obtenerPorId);

  return router;
}
