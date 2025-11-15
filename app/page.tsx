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
      <Header />
      <div className="relative z-10">
        <LandingHero />
        <Sidebar />
      </div>
    </main>
  );
}
