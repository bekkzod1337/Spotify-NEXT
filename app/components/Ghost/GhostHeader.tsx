 'use client';

import { Download, Home, Search } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function GhostHeader() {
  return (
    <header className="w-full h-20 bg-black/80 border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-50 backdrop-blur-sm">
      {/* Left section */}
      <Link href="/">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-lg">A</span>
          </div>
          <span className="text-white font-bold text-xl hidden sm:block">Aura</span>
        </motion.div>
      </Link>

      {/* Center - Search */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
          <input
            type="search"
            placeholder="What do you want to listen to?"
            className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-[#1DB954] transition duration-200"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6">
          <a href="/premium" className="text-white/70 hover:text-white transition-colors font-medium text-sm">
            Premium
          </a>
          <a href="/support" className="text-white/70 hover:text-white transition-colors font-medium text-sm">
            Support
          </a>
          <a href="/download" className="text-white/70 hover:text-white transition-colors font-medium text-sm">
            Download
          </a>
        </nav>

        <div className="w-px h-6 bg-white/20" />

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-white/70 hover:text-white transition-colors font-medium text-sm"
          >
            Sign up
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black px-6 py-2 rounded-full font-bold transition-all duration-200"
          >
            Log in
          </motion.button>
        </div>
      </div>
    </header>
  );
}

export default GhostHeader;
