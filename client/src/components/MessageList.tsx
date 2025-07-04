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
    <div className="space-y-6 px-4 py-10 min-h-[60vh] bg-gradient-to-br from-[#23272a] via-[#23272a]/80 to-[#18191c] rounded-3xl shadow-2xl border border-[#23272a]/40 backdrop-blur-md">
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
            className={`flex items-end group ${isOwn ? 'justify-end' : 'justify-start'} transition-all duration-200`}
          >
            {!isOwn && (
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#5865f2] to-[#404eed] rounded-full flex items-center justify-center text-xl font-extrabold text-white shadow-xl border-4 border-[#23272a] mr-3 ring-2 ring-[#5865f2]/40 group-hover:ring-4 transition-all duration-200">
                {initials}
              </div>
            )}
            <div className={`flex flex-col max-w-2xl ${isOwn ? 'items-end' : 'items-start'}`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-white text-base hover:underline cursor-pointer drop-shadow-lg">
                  {msg.author}
                </span>
                <span className="text-xs text-[#b9bbbe] opacity-70 mt-0.5 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div
                className={`relative px-6 py-4 rounded-3xl text-base shadow-lg break-words leading-relaxed transition-all duration-200 ${
                  isOwn
                    ? 'bg-gradient-to-br from-[#5865f2]/90 to-[#404eed]/90 text-white border border-[#5865f2]/40'
                    : 'bg-[#23272a]/90 text-[#dcddde] border border-[#36393f]/70'
                } group-hover:scale-[1.03] group-hover:shadow-2xl`}
              >
                {msg.isImage ? (
                  <img
                    src={msg.text}
                    alt="Uploaded content"
                    className="rounded-2xl max-h-64 shadow-lg border border-[#36393f]/40 hover:scale-105 transition-transform duration-200"
                    style={{ maxWidth: '100%' }}
                  />
                ) : (
                  <span className="whitespace-pre-line">{msg.text}</span>
                )}
              </div>
            </div>
            {isOwn && (
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#5865f2] to-[#404eed] rounded-full flex items-center justify-center text-xl font-extrabold text-white shadow-xl border-4 border-[#23272a] ml-3 ring-2 ring-[#5865f2]/40 group-hover:ring-4 transition-all duration-200">
                {initials}
              </div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}