import { Router } from 'express';
import { getStats, getChartData } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate, authorize('ADMIN'));
router.get('/stats', getStats);
router.get('/chart-data', getChartData);
export default router;
