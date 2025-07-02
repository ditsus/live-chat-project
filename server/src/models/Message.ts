import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isImage: { type: Boolean, default: false },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;