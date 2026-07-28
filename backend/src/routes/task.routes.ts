import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';

const router = Router();
router.use(authenticate); // all task routes require auth

router.post('/', validate(createTaskSchema), TaskController.create);
router.get('/', TaskController.list);
router.put('/:id', validate(updateTaskSchema), TaskController.update);
router.delete('/:id', TaskController.delete);

export default router;