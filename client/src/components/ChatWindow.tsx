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
    <div className="flex h-screen text-white bg-gray-800">
      <div className="flex flex-col w-64 bg-gray-900">
        <div className="px-4 py-3 font-bold text-lg shadow-md">
          Live Chat
        </div>
        <div className="flex-1 p-2 overflow-y-auto">
          <h2 className="px-2 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Text Channels
          </h2>
          <UserList users={users} />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-900 shadow-md">
          <h2 className="text-lg font-semibold"># general</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-gray-700">
          <MessageList messages={messages} />
        </div>
        <div className="p-4 bg-gray-700">
          <MessageInput />
        </div>
      </div>
    </div>
  );
}
