import { useEffect, useState } from 'react';
import socket from '@/utils/socket';
import { ChatMessage } from '@/types';
import ChatWindow from '@/components/ChatWindow';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.on('message:receive', (msg: ChatMessage) =>
      setMessages(prev => [...prev, msg])
    );

    socket.on('users:update', (users: string[]) => {
      setUsers(users);
    });

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chat/history`)
      .then(res => res.json())
      .then((data: ChatMessage[]) => setMessages(data));

    return () => {
      socket.off('message:receive');
      socket.off('users:update');
    };
  }, []);

  return <ChatWindow messages={messages} users={users} />;
}
