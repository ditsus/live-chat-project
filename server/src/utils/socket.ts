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
        });
        await msg.save();

      // Broadcast to all clients
      io.emit('message:receive', msg);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}