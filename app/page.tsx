'use client';

import LandingHero from './components/LandingHero';
import { FaGithub, FaTelegram, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export default function HomePage() {
  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-black">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source src="/1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark Overlay for better text visibility */}
      <div className="fixed inset-0 bg-black/40 z-5 pointer-events-none" />
      
      <Header />
      <div className="relative z-10">
        <LandingHero />
        <Sidebar />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="text-[#1DB954] text-center">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2">Scroll to explore</div>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
