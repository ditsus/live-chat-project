import { Request, Response } from 'express';
import Message from '../models/Message';

export async function getHistory(req: Request, res: Response) {
  console.log('⚡️ GET /api/chat/history hit at', new Date().toISOString());
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    // Convert timestamps to ISO strings
    const serialized = messages.map(msg => ({
      ...msg.toObject(),
      timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
    }));
    console.log('   returning', messages.length, 'messages');
    res.json(serialized);
  } catch (err) {
    console.error('getHistory error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
}

export async function postMessage(req: Request, res: Response) {
  const { author, text, isImage } = req.body;
  try {
    const msg = new Message({ author, text, isImage: !!isImage, timestamp: new Date() });
    await msg.save();
    // Convert timestamp to ISO string
    const serialized = {
      ...msg.toObject(),
      timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
    };
    res.status(201).json(serialized);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
}
