import { Router } from 'express';
import { getHistory, postMessage } from '../controllers/chatController';

const router = Router();

// Fetch last 100 messages
router.get('/history', getHistory);

// Save a new message
router.post('/message', postMessage);

export default router;


