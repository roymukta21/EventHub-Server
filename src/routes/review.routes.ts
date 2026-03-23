import { Router } from 'express';
import { createReview, getReviewsByItem, deleteReview } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.post('/', authenticate, createReview);
router.get('/item/:itemId', getReviewsByItem);
router.delete('/:id', authenticate, deleteReview);
export default router;
