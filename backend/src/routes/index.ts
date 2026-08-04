import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import healthRoutes from './health.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/health', healthRoutes);

export default router;
