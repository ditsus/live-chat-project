interface Message {
  _id?: string;
  author: string;
  text: string;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div style={{ height: '60vh', overflowY: 'scroll', padding: '0.5rem', background: '#f9f9f9' }}>
      {messages.map(msg => (
        <div key={msg._id || msg.timestamp} style={{ marginBottom: '0.5rem' }}>
          <strong>{msg.author}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
}