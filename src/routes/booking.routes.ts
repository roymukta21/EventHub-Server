import { Router } from 'express';
import { createBooking, getBookings, updateBooking, deleteBooking } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);
router.post('/', createBooking);
router.get('/', getBookings);
router.patch('/:id', updateBooking);
router.delete('/:id', deleteBooking);
export default router;
