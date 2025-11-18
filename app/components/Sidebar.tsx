'use client';

import React, { useState, useEffect } from 'react';
import { Home, Search, Library, Plus, Heart, LogOut, Settings, Disc3, TrendingUp, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Playlist = {
  id: string;
  name: string;
  color: string;
  trackIds: string[];
  createdAt: number;
};

export default function Sidebar() {
  const [activeNav, setActiveNav] = useState('home');
  const [hoveredPlaylist, setHoveredPlaylist] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlistSearchQuery, setPlaylistSearchQuery] = useState('');
  const [showAllPlaylists, setShowAllPlaylists] = useState(false);

  // Load playlists from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aura_playlists');
    if (saved) {
      try {
        setPlaylists(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load playlists:', e);
      }
    }
  }, []);

  // Listen for playlist changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('aura_playlists');
      if (saved) {
        try {
          setPlaylists(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load playlists:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) {
      alert('Please enter a playlist name');
      return;
    }

    const colors = [
      'from-blue-500 to-blue-700',
      'from-pink-500 to-pink-700',
      'from-purple-500 to-purple-700',
      'from-green-500 to-green-700',
      'from-indigo-500 to-indigo-700',
      'from-orange-500 to-orange-700',
    ];

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName,
      color: colors[Math.floor(Math.random() * colors.length)],
      trackIds: [],
      createdAt: Date.now(),
    };

    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    localStorage.setItem('aura_playlists', JSON.stringify(updated));
    setNewPlaylistName('');
    setIsCreatingPlaylist(false);

    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent('storage', { key: 'aura_playlists' }));
  };

  return (
    <aside className="fixed top-0 left-0 w-[320px] h-screen bg-gradient-to-b from-black via-black to-[#0a0a0a] overflow-y-auto p-6 border-r border-white/10 flex flex-col">
      
      {/* Spotify Logo / Branding */}
      <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/10">
        <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center flex-shrink-0">
          <Disc3 size={22} className="text-black" />
        </div>
        <span className="text-white font-bold text-xl">Aura</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-3 mb-8">
        <Link href="/">
          <motion.button
            onClick={() => setActiveNav('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition duration-200 ${
              activeNav === 'home'
                ? 'bg-[#1DB954] text-black'
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
          >
            <Home size={22} />
            <span className="font-semibold text-base">Home</span>
          </motion.button>
        </Link>

        <Link href="/search">
          <motion.button
            onClick={() => setActiveNav('search')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition duration-200 ${
              activeNav === 'search'
                ? 'bg-[#1DB954] text-black'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Search size={22} />
            <span className="font-semibold text-base">Search</span>
          </motion.button>
        </Link>

        <Link href="/library">
          <motion.button
            onClick={() => setActiveNav('library')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition duration-200 ${
              activeNav === 'library'
                ? 'bg-[#1DB954] text-black'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Library size={22} />
            <span className="font-semibold text-base">Your Library</span>
          </motion.button>
        </Link>
      </nav>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mb-8 pb-6 border-b border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreatingPlaylist(true)}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition duration-200"
        >
          <Plus size={22} />
          <span className="font-semibold text-base">Create Playlist</span>
        </motion.button>

        <Link href="/liked">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-gradient-to-r from-[#1DB954]/20 to-purple-500/20 border border-[#1DB954]/50 hover:border-[#1DB954] transition duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#1DB954] to-purple-500 rounded-md flex items-center justify-center flex-shrink-0">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="font-semibold text-base text-white">Liked Songs</span>
          </motion.button>
        </Link>
      </div>

      {/* Create Playlist Modal */}
      {isCreatingPlaylist && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsCreatingPlaylist(false)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#282828] rounded-lg p-6 w-80 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Create Playlist</h3>
              <button
                onClick={() => setIsCreatingPlaylist(false)}
                className="text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
              autoFocus
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-[#1DB954] focus:outline-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsCreatingPlaylist(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={createPlaylist}
                disabled={!newPlaylistName.trim()}
                className="px-4 py-2 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-bold text-sm transition"
              >
                Create
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Playlists Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/70 font-bold text-xs uppercase tracking-wider">Your Playlists</h3>
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCreatingPlaylist(true)}
          className="text-white/50 cursor-pointer hover:text-white/80 transition"
        >
          <Plus size={16} />
        </motion.button>
      </div>

      {/* Playlists List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {playlists.length === 0 ? (
          <p className="text-white/40 text-xs py-4 text-center">No playlists yet</p>
        ) : (
          playlists.map((playlist) => (
            <motion.div
              key={playlist.id}
              onMouseEnter={() => setHoveredPlaylist(playlist.id)}
              onMouseLeave={() => setHoveredPlaylist(null)}
              whileHover={{ x: 4 }}
              className="group relative px-3 py-2 rounded-lg cursor-pointer transition duration-200 hover:bg-white/10"
            >
              <Link href="/library">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#1DB954] to-blue-500 rounded flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-200">
                    <TrendingUp size={14} className="text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{playlist.name}</p>
                    <p className="text-white/40 text-xs truncate">{playlist.trackIds.length} songs</p>
                  </div>
                </div>
              </Link>
              {hoveredPlaylist === playlist.id && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-[#1DB954] rounded-full hover:scale-110 transition"
                >
                  <Heart size={12} className="text-black fill-black" />
                </motion.button>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom Section - User Actions */}
      <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition duration-200 text-sm"
        >
          <Settings size={18} />
          <span>Settings</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-white/70 hover:text-[#1DB954] hover:bg-white/5 transition duration-200 text-sm"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </motion.button>
      </div>
    </aside>
  );
}
