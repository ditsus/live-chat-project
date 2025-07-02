import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import connectDB from './db/connect';
import chatRoutes from './routes/chatRoutes';
import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import setupSocket from './utils/socket';

dotenv.config();
const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Enable CORS for HTTP routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// HTTP endpoints
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);

app.use('/uploads', express.static('uploads'));

const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: '*' } });

// Connect to MongoDB
connectDB(process.env.MONGODB_URI!);

// Socket.IO handlers
setupSocket(io);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});