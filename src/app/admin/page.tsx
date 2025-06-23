'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../components/ToastProvider';

export default function AdminPage() {
  const [publicUrl, setPublicUrl] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const getShareToken = async () => {
      try {
        const res = await axios.get('/api/admin');
        const { shareToken } = res.data;

        const encodedToken = btoa(shareToken);
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const shareLink = `${baseUrl}/details/${encodedToken}`;
        setPublicUrl(shareLink);
      } catch (err: any) {
        const msg = err.response?.data?.error || 'Failed to get share token';
        setError(msg);
        if (msg.toLowerCase().includes('session expired')) {
          showToast('Session expired. Please log in again.', 'error');
        }

      }
    };

    getShareToken();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] dark:bg-[#18181b]">
      <div className="card w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Admin Panel</h1>
        {error ? (
          <p className="text-red-500 mb-2">{error}</p>
        ) : publicUrl ? (
          <div className="flex flex-col items-center gap-3">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition break-all max-w-full"
            >
              {publicUrl}
            </a>
            <button
              className="mt-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              onClick={() => {
                navigator.clipboard.writeText(publicUrl);
                showToast('URL copied!');
              }}
            >
              Copy Link
            </button>
          </div>
        ) : (
          <p className="text-gray-500">Generating share link...</p>
        )}
      </div>
    </div>
  );
}
