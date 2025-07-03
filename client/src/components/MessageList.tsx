import { ChatMessage } from '@/types';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({ messages }: MessageListProps) {
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : undefined;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="space-y-4 px-6">
      {messages.map((msg) => {
        const isOwn = msg.author === username;
        const initials = msg.author
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();
        return (
          <div
            key={msg._id || msg.timestamp}
            className="flex items-start group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-[#5865f2] rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md mt-1">
              {initials}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-white text-sm hover:underline cursor-pointer">
                  {msg.author}
                </span>
                <span className="text-xs text-[#b9bbbe] mt-0.5">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>
              <div
                className={`mt-1 px-5 py-3 rounded-lg text-base shadow-sm max-w-2xl break-words leading-relaxed ${
                  isOwn
                    ? 'bg-[#5865f2]/10 text-white'
                    : 'bg-[#36393f] text-[#dcddde]'
                }`}
              >
                {msg.isImage ? (
                  <img
                    src={msg.text}
                    alt="Uploaded content"
                    className="rounded-lg max-h-60"
                    style={{ maxWidth: '100%' }}
                  />
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}