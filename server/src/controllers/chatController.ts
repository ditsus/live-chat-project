import { Request, Response } from 'express';
import Message from '../models/Message';

export async function getHistory(req: Request, res: Response) {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
}

export async function postMessage(req: Request, res: Response) {
  const { author, text } = req.body;
  try {
    const msg = new Message({ author, text });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
}