'use client';

import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          © {new Date().getFullYear()} Global Batteries. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;