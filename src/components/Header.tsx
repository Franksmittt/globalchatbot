'use client';

import { motion } from 'framer-motion';
import { Bot, LogOut, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Bot className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">
              Chat Manager
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <div className="hidden sm:flex items-center space-x-2">
              <User className="h-6 w-6 text-gray-500" />
              <span className="text-gray-700 font-medium">John Doe</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:text-red-500 transition-colors" />
              Log Out
            </motion.button>
          </motion.div>
        </div>
      </nav>
    </header>
  );
};

export default Header;