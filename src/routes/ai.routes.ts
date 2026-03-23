import { Router } from 'express';
import { chat, generateDescription, reviewSummary } from '../controllers/ai.controller';

const router = Router();
router.post('/chat', chat);
router.post('/generate-description', generateDescription);
router.post('/review-summary', reviewSummary);
export default router;
