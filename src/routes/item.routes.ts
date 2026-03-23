import { Router } from 'express';
import { createItem, getItems, getItemById, updateItem, deleteItem } from '../controllers/item.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', authenticate, createItem);
router.patch('/:id', authenticate, updateItem);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteItem);
export default router;
