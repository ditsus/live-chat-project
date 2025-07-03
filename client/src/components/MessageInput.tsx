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
    } else if (text) {
      socket.emit('message:new', { author: username, text });
      setText('');
    }
  };

  return (
    <div>
      {file && (
        <div className="mb-2 flex items-center gap-4">
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="max-h-40 rounded-lg border border-[#23272a] shadow"
          />
          <button
            type="button"
            onClick={() => setFile(null)}
            className="ml-2 p-2 rounded-full bg-[#23272a] hover:bg-red-500 text-white text-lg flex items-center justify-center"
            title="Remove image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
      <div className="flex items-center bg-[#40444b] p-4 rounded-lg border border-[#23272a]">
        <label
          htmlFor="file-upload"
          className="p-3 mr-3 text-3xl text-[#b9bbbe] rounded-full cursor-pointer hover:bg-[#36393f] flex items-center justify-center border-2 border-[#23272a] hover:border-indigo-400 transition shadow-lg"
          title="Upload image"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="hidden"
          id="file-upload"
          ref={fileInputRef}
        />
        <input
          className="flex-1 px-5 py-3 text-white bg-transparent rounded-full focus:outline-none border-none placeholder-[#b9bbbe] text-base"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message #general"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              send();
            }
          }}
          disabled={uploading}
        />
        <button
          onClick={send}
          className="px-3 py-2 ml-2 text-white bg-[#5865f2] rounded-full hover:bg-[#4752c4] focus:outline-none flex items-center justify-center disabled:opacity-50"
          disabled={uploading}
          title="Send message"
        >
          {uploading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
    </div>
  );
}