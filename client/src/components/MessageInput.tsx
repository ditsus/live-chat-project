import { useState, useRef } from 'react';
import socket from '../utils/socket';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function MessageInput() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
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
      setUploading(true);
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
        // Save image message to DB via REST API
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chat/message`,
          {
            author: username,
            text: response.data.filePath,
            isImage: true,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
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
      } finally {
        setUploading(false);
      }
    } else if (text.trim()) {
      // Save text message to DB via REST API
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chat/message`,
          {
            author: username,
            text,
            isImage: false,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        socket.emit('message:new', {
          author: username,
          text,
          isImage: false,
        });
        setText('');
      } catch (err) {
        setError('Failed to send message.');
      }
    }
  };

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-[#23272a] via-[#23272a]/80 to-[#18191c] rounded-2xl shadow-lg px-6 py-4 border border-[#23272a]/40">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          // Always allow re-selecting the same file by resetting the input value
          if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            // Reset input value so the same file can be selected again after removal
            e.target.value = '';
          }
        }}
      />
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5865f2] hover:bg-[#404eed] text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#5865f2]/50"
        onClick={() => fileInputRef.current?.click()}
        title="Attach image"
        type="button"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 10-2.828-2.828z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7V3m0 0h-4m4 0l-7 7"
          ></path>
        </svg>
      </button>
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-white placeholder-[#b9bbbe] px-4 py-2 rounded-xl border border-[#36393f]/60 focus:border-[#5865f2] transition-all text-base shadow-sm"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        disabled={uploading}
      />
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#5865f2] to-[#404eed] hover:scale-105 text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#5865f2]/50"
        onClick={send}
        disabled={uploading || (!text.trim() && !file)}
        type="button"
        title="Send"
      >
        {uploading ? (
          <svg
            className="animate-spin w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        )}
      </button>
      {file && (
        <span className="ml-2 px-3 py-1 rounded-full bg-[#5865f2]/20 text-[#5865f2] text-xs font-semibold flex items-center gap-1">
          {file.name}
          <button
            className="ml-1 text-[#5865f2] hover:text-red-500 focus:outline-none"
            onClick={() => {
              setFile(null);
              // Reset input value so the same file can be selected again
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            type="button"
            title="Remove file"
          >
            &times;
          </button>
        </span>
      )}
      {error && (
        <span className="ml-4 text-red-400 text-xs font-semibold animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
}