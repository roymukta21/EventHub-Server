import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, updateUserRole } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/', authorize('ADMIN'), getAllUsers);
router.get('/:id', getUserById);
router.patch('/role', authorize('ADMIN'), updateUserRole);
router.patch('/:id', updateUser);
router.delete('/:id', authorize('ADMIN'), deleteUser);
export default router;
