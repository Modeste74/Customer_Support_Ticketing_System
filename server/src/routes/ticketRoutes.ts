import express from 'express';
import {
  createTicket,
  getUserTickets,
  getAllTickets,
  replyToTicket,
  updateTicketStatus,
  getTicketById,
} from '../controllers/ticketController';
import { protect, adminOnly, } from '../middleware/authMiddleware';

const router = express.Router();


router.post('/', protect, createTicket);
router.get('/', protect, getUserTickets);
router.get('/all', protect, adminOnly, getAllTickets);
router.get('/:id', protect, getTicketById);
router.put('/:id/reply', protect, replyToTicket);
router.put('/:id/status', protect, updateTicketStatus);

export default router;