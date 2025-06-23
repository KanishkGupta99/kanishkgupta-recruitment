'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useToast } from '../components/ToastProvider';
import { loginSchema } from '../schemas/login.schema';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { showToast } = useToast();

  const validateForm = () => {
    try {
      loginSchema.parse({ username, password });
      setFormErrors({});
      return true;
    } catch (err: any) {
      const errors = err.errors.reduce((acc: { [key: string]: string }, error: any) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setFormErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const res = await axios.post('/api/login', { username, password });

      if (res.data.success) {
        showToast('Logged in successfully!');
        router.push('/admin');
      } else {
        setError(res.data.error || 'Login failed');
        showToast(res.data.error || 'Login failed', 'error');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Something went wrong';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] dark:bg-[#18181b]">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className={`w-full ${formErrors.username ? 'border-red-500' : ''}`}
            />
            {formErrors.username && (
              <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={`w-full ${formErrors.password ? 'border-red-500' : ''}`}
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full mt-2">Login</button>
        </form>
      </div>
    </div>
  );
}
