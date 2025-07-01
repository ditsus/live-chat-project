import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatWindow({ messages }: { messages: any[] }) {
  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem', border: '1px solid #ddd' }}>
      <MessageList messages={messages} />
      <MessageInput />
    </div>
  );
}
