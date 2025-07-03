import { ChatMessage } from '@/types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';

export default function ChatWindow({
  messages,
  users,
}: {
  messages: ChatMessage[];
  users: string[];
}) {
  return (
    <div className="flex h-screen text-[#dcddde] bg-[#36393f]">
      <aside className="flex flex-col w-64 bg-[#2f3136] border-r border-[#23272a]">
        <div className="px-4 py-4 font-extrabold text-lg tracking-wide text-white border-b border-[#23272a]">
          <span className="inline-flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 3h-6a2 2 0 00-2 2v3a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2z"></path></svg>
            Live Chat
          </span>
        </div>
        <div className="flex-1 p-2 overflow-y-auto">
          <h2 className="px-2 mb-2 text-xs font-semibold tracking-wider text-[#b9bbbe] uppercase">
            Users Online
          </h2>
          <UserList users={users} />
        </div>
      </aside>
      <main className="flex flex-col flex-1 bg-[#36393f]">
        <header className="flex items-center px-6 py-3 border-b border-[#23272a] bg-[#36393f]">
          <h2 className="text-lg font-semibold text-white"># general</h2>
        </header>
        <section className="flex-1 px-0 py-4 overflow-y-auto">
          <MessageList messages={messages} />
        </section>
        <footer className="px-6 py-4 bg-[#40444b] border-t border-[#23272a]">
          <MessageInput />
        </footer>
      </main>
    </div>
  );
}
