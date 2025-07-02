import { ChatMessage } from '@/types';

interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((msg, _index) => (
        <div key={msg._id || msg.timestamp} className="flex items-start hover:bg-gray-600 p-2 rounded">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-500 rounded-full"></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white">
              {msg.author}
              <span className="ml-2 text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </p>
            {msg.isImage ? (
              <img
                src={msg.text}
                alt="Uploaded content"
                className="mt-1 rounded-lg"
                style={{ maxHeight: '200px', maxWidth: '100%' }}
              />
            ) : (
              <p className="text-sm text-gray-300">{msg.text}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}