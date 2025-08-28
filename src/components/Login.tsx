'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded credentials for demonstration
    const validUsername = 'admin';
    const validPassword = 'admin';

    // Check if the entered credentials are correct
    if (username === validUsername && password === validPassword) {
      console.log('Login successful! Redirecting to dashboard...');
      router.push('/dashboard');
    } else {
      console.log('Login failed: Incorrect username or password.');
      alert('Login failed: Incorrect username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200"
      >
        <div className="flex flex-col items-center justify-center mb-6">
          <Bot className="h-12 w-12 text-blue-600 mb-2" />
          <h1 className="text-3xl font-bold text-gray-900">
            Staff Login
          </h1>
          <p className="text-gray-500 mt-1 text-center">
            Log in to your Global Batteries chat management dashboard.
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Sign In
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;