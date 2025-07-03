import { Server, Socket } from 'socket.io';
import Message from '../models/Message';

export default function setupSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on(
      'message:new',
      async (data: { author: string; text: string; isImage?: boolean }) => {
        // Save to MongoDB
        const msg = new Message({
          author: data.author,
          text: data.text,
          isImage: data.isImage || false,
          timestamp: new Date(),
        });
        await msg.save();

        // Broadcast to all clients with timestamp as ISO string
        const serialized = {
          ...msg.toObject(),
          timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
        };
        io.emit('message:receive', serialized);
      }
    );

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}