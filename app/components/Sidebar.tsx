'use client';

import React from 'react';
import { Home, Search, Library, Plus, Heart } from 'lucide-react';

const playlists = [
  "Chill Mix",
  "Insta Hits",
  "Your Top Songs 2021",
  "Mellow Songs",
  "Anime Lofi & Chillhop Music",
  "BG Afro “Select” Vibes",
  "Afro “Select” Vibes",
  "Happy Hits!",
  "Deep Focus",
  "Instrumental Study",
  "OST Compilations",
  "Nostalgia for old souled mill...",
  "Mixed Feelings",
];

export default function Sidebar() {
  return (
    <aside className="absolute top-0 left-0 w-[310px] h-screen bg-black overflow-y-auto p-6">
      
      {/* Logo / Top Nav */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Home size={24} className="text-white" />
          <span className="text-white font-bold text-lg">Home</span>
        </div>
        <div className="flex items-center gap-3 opacity-70">
          <Search size={24} className="text-white" />
          <span className="text-white font-bold text-lg">Search</span>
        </div>
        <div className="flex items-center gap-3 opacity-70">
          <Library size={24} className="text-white" />
          <span className="text-white font-bold text-lg">Your Library</span>
        </div>
      </div>

      {/* Create Playlist */}
      <div className="flex items-center gap-3 mt-6 opacity-70 hover:opacity-100 cursor-pointer mb-2">
        <Plus size={24} className="text-white" />
        <span className="text-white font-bold text-lg">Create Playlist</span>
      </div>

      {/* Liked Songs */}
      <div className="flex items-center gap-3 mb-6 opacity-70 hover:opacity-100 cursor-pointer">
        <div className="w-8 h-8 bg-gradient-to-br from-[#3822EA] to-[#C7E9D7] rounded-sm flex items-center justify-center">
          <Heart size={16} className="text-white" />
        </div>
        <span className="text-white font-bold text-lg">Liked Songs</span>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#282828] mb-4" />

      {/* Playlists */}
      <div className="flex flex-col gap-4">
        {playlists.map((pl, i) => (
          <span
            key={i}
            className="text-[#B3B3B3] font-medium text-base hover:text-white cursor-pointer"
          >
            {pl}
          </span>
        ))}
      </div>
    </aside>
  );
}
