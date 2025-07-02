import { useState, useRef } from 'react';
import socket from '../utils/socket';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function MessageInput() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const send = async () => {
    setError('');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (!token || !username) {
      setError('You must be logged in to send messages.');
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        socket.emit('message:new', {
          author: username,
          text: response.data.filePath,
          isImage: true,
        });
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        console.error('File upload failed', err);
        if (axios.isAxiosError(err) && err.response) {
          if (err.response.status === 401) {
            setError('Your session has expired. Please log in again.');
            setTimeout(() => router.push('/login'), 3000);
          } else {
            setError('File upload failed. Please try again.');
          }
        } else {
          setError('An unknown error occurred during file upload.');
        }
      }
    } else if (text) {
      socket.emit('message:new', { author: username, text });
      setText('');
    }
  };

  return (
    <div>
      {file && (
        <div className="mb-2">
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="max-h-40 rounded-lg"
          />
        </div>
      )}
      <div className="flex items-center bg-gray-600 p-2 rounded-lg">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="hidden"
          id="file-upload"
          ref={fileInputRef}
        />
        <label
          htmlFor="file-upload"
          className="p-2 mr-2 text-2xl font-bold text-gray-400 rounded-full cursor-pointer hover:bg-gray-500"
        >
          +
        </label>
        <input
          className="flex-1 px-4 py-2 text-white bg-gray-600 rounded-full focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message #general"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              send();
            }
          }}
        />
        <button
          onClick={send}
          className="px-4 py-2 ml-2 font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        >
          Send
        </button>
      </div>
      {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
    </div>
  );
}