'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Heart, MoreHorizontal } from 'lucide-react';
import Sidebar from '@/app/components/Sidebar';
import { useMusicContext, type Track } from '@/app/context/MusicContext';

export default function SearchPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [query, setQuery] = useState('');
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const { favorites, toggleFavorite, setPlaylist, setCurrentTrackIndex, setIsPlaying } = useMusicContext();

  useEffect(() => {
    setLoading(true);
    fetch('/musics/manifest.json')
      .then((res) => res.json())
      .then((data) => {
        setTracks(data.tracks || []);
        setLoading(false);
      })
      .catch(() => {
        setTracks([]);
        setLoading(false);
      });

    // Auto-focus search input
    searchInputRef.current?.focus();
  }, []);

  const filteredTracks = tracks.filter(
    (t) =>
      !query ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist?.toLowerCase().includes(query.toLowerCase())
  );

  const handleTrackPlay = (track: Track) => {
    const trackIndex = filteredTracks.findIndex(t => t.id === track.id);
    setPlaylist(filteredTracks, 'all');
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target === searchInputRef.current) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredTracks.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          if (selectedIndex >= 0) {
            e.preventDefault();
            handleTrackPlay(filteredTracks[selectedIndex]);
          }
          break;
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredTracks]);

  return (
    <div className="flex w-full min-h-screen bg-black">
      <Sidebar />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 ml-[320px] pb-32"
      >
        {/* Header Section */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-black to-transparent backdrop-blur-md border-b border-white/10 p-8">
          <h1 className="text-4xl font-bold text-white mb-6">Search</h1>

          {/* Search Input */}
          <div className="relative max-w-2xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search songs, artists... (press / to focus)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-6 py-3 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-[#1DB954] transition duration-200"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="px-8 py-8">
          {query && (
            <h2 className="text-2xl font-bold text-white mb-2">
              🔍 Results for "{query}"
            </h2>
          )}
          {query && filteredTracks.length > 0 && (
            <p className="text-white/60 text-sm mb-6">{filteredTracks.length} results found</p>
          )}

          {filteredTracks.length === 0 && query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-16"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎵</div>
                <div className="text-white/60 text-lg mb-2">No songs found</div>
                <div className="text-white/40 text-sm">Try searching for a different artist or song title</div>
              </div>
            </motion.div>
          )}

          {!query && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-16"
            >
              <div className="text-center">
                <Search size={48} className="text-white/20 mx-auto mb-4" />
                <div className="text-white/60 text-lg">Start typing to search for songs and artists</div>
                <div className="text-white/40 text-sm mt-2">Use arrow keys to navigate and Enter to play</div>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-16"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 border-4 border-white/20 border-t-[#1DB954] rounded-full mx-auto mb-4"
                />
                <div className="text-white/60">Loading tracks...</div>
              </div>
            </motion.div>
          )}

          {/* Tracks Grid */}
          {filteredTracks.length > 0 && (
            <div className="space-y-2">
              {filteredTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => {
                    setHoveredTrack(track.id);
                    setSelectedIndex(index);
                  }}
                  onMouseLeave={() => setHoveredTrack(null)}
                  className={`group flex items-center gap-4 p-3 rounded-lg transition duration-200 cursor-pointer ${
                    selectedIndex === index
                      ? 'bg-[#1DB954]/20 border border-[#1DB954]/50'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {/* Track Cover */}
                  <div className="relative w-14 h-14 flex-shrink-0">
                    {track.cover ? (
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-full h-full rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1DB954] to-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-2xl text-black">♪</span>
                      </div>
                    )}
                    {hoveredTrack === track.id && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => handleTrackPlay(track)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md hover:bg-black/60 transition"
                      >
                        <Play size={24} className="text-white fill-white ml-1" />
                      </motion.button>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{track.title}</p>
                    <p className="text-white/60 text-sm truncate">{track.artist || 'Unknown Artist'}</p>
                  </div>

                  {/* Duration */}
                  <div className="text-white/60 text-sm min-w-max">
                    {track.duration || '3:00'}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFavorite(track.id)}
                      className="p-2 rounded-full hover:bg-white/20 transition"
                    >
                      <Heart
                        size={18}
                        className={
                          favorites.has(track.id)
                            ? 'fill-[#1DB954] text-[#1DB954]'
                            : 'text-white/60'
                        }
                      />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full hover:bg-white/20 transition"
                    >
                      <MoreHorizontal size={18} className="text-white/60" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
