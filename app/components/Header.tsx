'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function LibraryHeader() {
  return (
    <header className="absolute top-0 left-[310px] w-[1072px] h-[80px] bg-[#070707] flex items-center px-6 justify-between">
      
      {/* Back / Forward buttons */}
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70">
          <ChevronLeft size={20} className="text-white" />
        </div>
        <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70">
          <ChevronRight size={20} className="text-white" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <div className="flex items-center justify-center w-[109px] h-[54px] bg-white/30 rounded text-white font-bold cursor-pointer">
          Playlists
        </div>
        <div className="flex items-center justify-center w-[115px] h-[54px] bg-white/10 rounded text-white font-bold cursor-pointer">
          Podcasts
        </div>
        <div className="flex items-center justify-center w-[95px] h-[54px] bg-white/10 rounded text-white font-bold cursor-pointer">
          Artists
        </div>
        <div className="flex items-center justify-center w-[103px] h-[54px] bg-white/10 rounded text-white font-bold cursor-pointer">
          Albums
        </div>
      </div>

      {/* User Avatar / Profile */}
      <div className="flex items-center gap-3 bg-black/80 px-3 py-1 rounded-full">
        <div className="w-8 h-8 rounded-full bg-[url('/avatar.png')] bg-cover"></div>
        <span className="text-white font-bold text-lg">davedirect3</span>
        <ChevronDown size={16} className="text-white" />
      </div>
    </header>
  );
}
