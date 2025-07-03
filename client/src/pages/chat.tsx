import { useEffect, useState } from 'react';
import socket from '@/utils/socket';
import { ChatMessage } from '@/types';
import ChatWindow from '@/components/ChatWindow';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    let didUnmount = false;
    // Fetch history first
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chat/history`)
      .then(res => res.json())
      .then((data: ChatMessage[]) => {
        if (didUnmount) return;
        setMessages(data);

        // Now set up socket listeners
        socket.on('message:receive', (msg: ChatMessage) => {
          setMessages(prev => {
            // Avoid duplicates by _id or timestamp
            if (prev.some(m => (m._id && m._id === msg._id) || (!m._id && m.timestamp === msg.timestamp))) return prev;
            return [...prev, msg];
          });
        });

        socket.on('users:update', (users: string[]) => {
          setUsers(users);
        });
      });

    return () => {
      didUnmount = true;
      socket.off('message:receive');
      socket.off('users:update');
    };
  }, []);

  return <ChatWindow messages={messages} users={users} />;
}
