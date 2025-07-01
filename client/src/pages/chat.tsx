import { useEffect, useState } from 'react';
import socket from '@/utils/socket';
import ChatWindow from '@/components/ChatWindow';

export default function ChatPage() {
  const [msgs, setMsgs] = useState<any[]>([]);

  useEffect(() => {
    socket.on('message:receive', m => setMsgs(p => [...p, m]));
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chat/history`)
      .then(r => r.json())
      .then(data => setMsgs(data));
    return () => { socket.off('message:receive'); };
  }, []);

  return <ChatWindow messages={msgs} />;
}
