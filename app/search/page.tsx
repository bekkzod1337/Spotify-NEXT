'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Heart, MoreHorizontal, Clock, TrendingUp, Zap } from 'lucide-react';
import Sidebar from '@/app/components/Sidebar';
import { useMusicContext, type Track } from '@/app/context/MusicContext';
import { searchYouTubeTracks } from '@/app/services/fullLengthMusicApi';

const TRENDING_SEARCHES = ['Drake', 'The Weeknd', 'Billie Eilish', 'Ariana Grande', 'Eminem'];

export default function SearchPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [query, setQuery] = useState('');
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const { favorites, toggleFavorite, setPlaylist, setCurrentTrackIndex, setIsPlaying } = useMusicContext();

  useEffect(() => {
    searchInputRef.current?.focus();
    const saved = localStorage.getItem('spotify_recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // Search tracks when query changes
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length > 0) {
        setLoading(true);
        try {
          const response = await fetch(`/api/deezer?action=search&q=${encodeURIComponent(query)}&limit=50`);
          const data = await response.json();
          
          const results = data.data?.map((track: any, idx: number) => ({
            id: track.id ? `deezer-${track.id}` : `dz-${idx}`,
            title: track.title || 'Unknown',
            artist: track.artist?.name || track.artist || 'Unknown Artist',
            cover: track.album?.cover_medium || track.album?.cover || '',
            duration: track.duration || 0,
            source: 'deezer',
            album: track.album?.title,
            preview: track.preview || '',
            src: track.preview || '',
          })) || [];
          
          setTracks(results);
        } catch (err) {
          console.error('Error searching Deezer:', err);
          setTracks([]);
        }
        setLoading(false);
        
        // Save to recent searches
        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
        setRecentSearches(updated);
        localStorage.setItem('spotify_recent_searches', JSON.stringify(updated));
      } else {
        setTracks([]);
      }
      setSelectedIndex(-1);
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleTrackPlay = (track: Track) => {
    const trackIndex = tracks.findIndex(t => t.id === track.id);
    setPlaylist(tracks, 'all');
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '3:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target === searchInputRef.current) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => prev < tracks.length - 1 ? prev + 1 : prev);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          if (selectedIndex >= 0) {
            e.preventDefault();
            handleTrackPlay(tracks[selectedIndex]);
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
  }, [selectedIndex, tracks]);

  return (
    <div className="flex w-full min-h-screen bg-black">
      <Sidebar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 ml-[320px] pb-32"
      >
        {/* Header with gradient background */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-[#1DB954]/30 via-black to-transparent backdrop-blur-lg border-b border-white/5">
          <div className="p-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-5xl font-bold text-white mb-8">Search Music</h1>

              {/* Search Input */}
              <div className="relative max-w-3xl">
                <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search songs, artists, albums... (press / to focus)"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(-1);
                  }}
                  className="w-full bg-gradient-to-r from-white/15 to-white/10 border border-white/20 rounded-full pl-16 pr-6 py-4 text-lg text-white placeholder-white/50 focus:outline-none focus:bg-white/25 focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/30 transition duration-200"
                />
                {query && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuery('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
                  >
                    ✕
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-12">
        </div>

        {/* Content Section */}
        <div className="px-8 py-12">
          {/* Results Section */}
          {query && tracks.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  <TrendingUp className="inline mr-3" size={28} />
                  Results for "{query}"
                </h2>
                <p className="text-white/60">{tracks.length} songs found</p>
              </div>

              {/* Tracks Grid */}
              <div className="space-y-2">
                {tracks.map((track: Track, index: number) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onMouseEnter={() => {
                      setHoveredTrack(track.id);
                      setSelectedIndex(index);
                    }}
                    onMouseLeave={() => setHoveredTrack(null)}
                    className={`group flex items-center gap-4 p-4 rounded-xl transition duration-200 cursor-pointer backdrop-blur-sm ${
                      selectedIndex === index
                        ? 'bg-gradient-to-r from-[#1DB954]/30 to-[#1DB954]/10 border border-[#1DB954]/50'
                        : 'hover:bg-white/10 border border-transparent hover:border-white/20'
                    }`}
                  >
                    {/* Track Cover */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      {track.cover ? (
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954] to-blue-500 flex items-center justify-center">
                        <span className="text-2xl">♪</span>
                      </div>
                      {hoveredTrack === track.id && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          onClick={() => handleTrackPlay(track)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition"
                        >
                          <Play size={28} className="text-white fill-white ml-1" />
                        </motion.button>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate text-lg">{track.title}</p>
                      <p className="text-white/60 text-sm truncate">{track.artist || 'Unknown Artist'}</p>
                    </div>

                    {/* Duration */}
                    <div className="text-white/60 text-sm min-w-max flex items-center gap-2">
                      <Clock size={16} />
                      {formatDuration(track.duration)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleFavorite(track.id)}
                        className="p-2 rounded-full hover:bg-white/20 transition"
                      >
                        <Heart
                          size={20}
                          className={
                            favorites.has(track.id)
                              ? 'fill-[#1DB954] text-[#1DB954]'
                              : 'text-white/60 hover:text-white'
                          }
                        />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full hover:bg-white/20 transition"
                      >
                        <MoreHorizontal size={20} className="text-white/60 hover:text-white" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No Results */}
          {query && tracks.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Search size={80} className="text-white/10 mx-auto mb-6" />
                </motion.div>
                <div className="text-white/60 text-xl font-semibold mb-2">No songs found</div>
                <div className="text-white/40 text-base">Try searching for a different artist or song</div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-14 h-14 border-4 border-white/20 border-t-[#1DB954] rounded-full mx-auto mb-6"
                />
                <div className="text-white/60 text-lg font-medium">Searching for tracks...</div>
              </div>
            </motion.div>
          )}

          {/* Empty/Home State */}
          {!query && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {/* Trending Searches */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp size={24} className="text-[#1DB954]" />
                    Trending Artists
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {TRENDING_SEARCHES.map((artist, idx) => (
                      <motion.button
                        key={artist}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuery(artist)}
                        className="p-6 bg-gradient-to-br from-[#1DB954]/20 to-[#1DB954]/5 hover:from-[#1DB954]/30 hover:to-[#1DB954]/15 rounded-xl border border-[#1DB954]/30 hover:border-[#1DB954]/50 transition"
                      >
                        <div className="text-lg font-semibold text-white">{artist}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Clock size={24} className="text-white/60" />
                      Recent Searches
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recentSearches.map((search, idx) => (
                        <motion.button
                          key={search}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ x: 5 }}
                          onClick={() => setQuery(search)}
                          className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition text-white font-medium text-left"
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Instruction */}
              {recentSearches.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center py-16"
                >
                  <div className="text-center">
                    <Zap size={64} className="text-white/20 mx-auto mb-6" />
                    <div className="text-white/60 text-xl mb-2">Start Your Search</div>
                    <div className="text-white/40 text-base">Search for songs, artists, or albums to get started</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
