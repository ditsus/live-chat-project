import { Schema, model } from 'mongoose';

interface IMessage {
  author: string;
  text: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  author: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default model<IMessage>('Message', MessageSchema);