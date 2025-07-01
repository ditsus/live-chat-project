import { useState } from 'react';
import socket from '../utils/socket';

export default function MessageInput() {
  const [text, setText] = useState('');

  const send = () => {
    if (!text) return;
    socket.emit('message:new', { author: 'Anon', text });
    setText('');
  };

  return (
    <div style={{ display: 'flex', marginTop: '1rem' }}>
      <input
        style={{ flex: 1, padding: '0.5rem' }}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={send} style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
        Send
      </button>
    </div>
  );
}