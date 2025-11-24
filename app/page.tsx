'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { useMusicContext, type Track } from './context/MusicContext';
import Image from 'next/image';

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const { favorites, toggleFavorite, setPlaylist, setCurrentTrackIndex, setIsPlaying } = useMusicContext();

  useEffect(() => {
    const loadTracks = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/deezer?action=trending&limit=80');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        const deezerTracks = (data.data || []).map((track: any) => ({
          id: `deezer-${track.id}`,
          title: track.title || 'Unknown',
          artist: track.artist?.name || 'Unknown Artist',
          src: track.preview || '',
          preview: track.preview || '',
          album: track.album?.title || 'Unknown Album',
          cover: track.album?.cover_medium || track.album?.cover_big || '',
          duration: track.duration || 0,
          source: 'deezer',
        } as Track));
        setTracks(deezerTracks);
      } catch (error) {
        console.error('Error loading tracks:', error);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

  const handleTrackPlay = (track: Track, index: number) => {
    setPlaylist(tracks, 'all');
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '3:45';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex w-full min-h-screen bg-black">
      <Sidebar />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 ml-[320px] pb-32 overflow-y-auto"
      >
        {/* Hero Header */}
        <motion.div
          className="sticky top-0 z-40 bg-gradient-to-b from-[#1DB954]/30 via-black/50 to-black backdrop-blur-lg border-b border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative p-8 h-32 flex items-end">
            <motion.div
              className="absolute -top-20 -right-20 w-64 h-64 bg-[#1DB954] rounded-full blur-3xl opacity-20"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <div className="relative z-10">
              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl font-black text-white mb-2"
              >
                Welcome back, Music Lover
              </motion.h1>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/70 text-lg"
              >
                Discover new music and enjoy your favorites
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-8 space-y-16">
          {/* Quick Access Grid */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading ? (
                <div className="col-span-4 text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-white/20 border-t-[#1DB954] rounded-full mx-auto"
                  />
                </div>
              ) : (
                tracks.slice(0, 4).map((track, idx) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:border-white/30 hover:bg-white/20 cursor-pointer transition duration-300"
                  >
                    {track.cover && (
                      <div className="relative w-full h-24 mb-3 rounded-md overflow-hidden">
                        <Image
                          src={track.cover}
                          alt={track.title}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%231DB954" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="50" fill="white" text-anchor="middle" dy=".3em"%3E♪%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                    <p className="text-white font-semibold text-sm truncate mb-1">{track.title}</p>
                    <p className="text-white/60 text-xs truncate">{track.artist}</p>

                    <button
                      onClick={() => handleTrackPlay(track, idx)}
                      className="absolute bottom-3 right-3 w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg hover:bg-[#1ed760] transform translate-y-2 group-hover:translate-y-0 transition duration-300"
                    >
                      <Play size={18} className="text-black fill-black" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Trending Now */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
              <a href="/search" className="text-[#1DB954] hover:text-[#1ed760] text-sm font-semibold transition">
                Explore all
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tracks.slice(4, 12).map((track, idx) => (
                <motion.div
                  key={`trending-${track.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:border-[#1DB954]/50 overflow-hidden cursor-pointer"
                >
                  {track.cover && (
                    <div className="relative w-full h-32 mb-4 rounded-md overflow-hidden">
                      <Image
                        src={track.cover}
                        alt={track.title}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%231DB954" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="50" fill="white" text-anchor="middle" dy=".3em"%3E♪%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-white font-bold text-sm truncate mb-1">{track.title}</p>
                  <p className="text-white/60 text-xs truncate mb-4">{track.artist}</p>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleTrackPlay(track, tracks.indexOf(track))}
                      className="flex-1 px-3 py-2 bg-[#1DB954] hover:bg-[#1ed760] rounded-full text-black font-bold text-sm flex items-center justify-center gap-1 transition"
                    >
                      <Play size={14} className="fill-current" />
                      Play
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(track.id)}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                    >
                      <Heart
                        size={14}
                        className={`${
                          favorites.has(track.id)
                            ? 'fill-[#1DB954] text-[#1DB954]'
                            : 'text-white/60'
                        }`}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recently Played */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recently Played</h2>
              <a href="#" className="text-[#1DB954] hover:text-[#1ed760] text-sm font-semibold transition">
                See all
              </a>
            </div>

            <div className="space-y-2">
              {tracks.slice(0, 6).map((track, idx) => (
                <motion.div
                  key={`recent-${track.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onMouseEnter={() => setHoveredTrack(track.id)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  whileHover={{ x: 4 }}
                  className="group flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition duration-200"
                >
                  <span className="text-white/40 text-sm w-6 text-right">{idx + 1}</span>

                  {track.cover && (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={track.cover}
                        alt={track.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%231DB954" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="50" fill="white" text-anchor="middle" dy=".3em"%3E♪%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{track.title}</p>
                    <p className="text-white/60 text-sm truncate">{track.artist}</p>
                  </div>

                  <span className="text-white/40 text-sm w-12 text-right">{formatDuration(track.duration)}</span>

                  {hoveredTrack === track.id && (
                    <div className="flex items-center gap-2">
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => toggleFavorite(track.id)}
                        className="p-2 hover:text-[#1DB954] transition"
                      >
                        <Heart
                          size={18}
                          className={`${
                            favorites.has(track.id)
                              ? 'fill-[#1DB954] text-[#1DB954]'
                              : 'text-white/60'
                          }`}
                        />
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => handleTrackPlay(track, tracks.indexOf(track))}
                        className="p-2 text-[#1DB954] hover:text-[#1ed760] transition"
                      >
                        <Play size={18} className="fill-current" />
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-2 text-white/60 hover:text-white transition"
                      >
                        <MoreHorizontal size={18} />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Your Favorites */}
          {favorites.size > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Favorites ({favorites.size})</h2>
                <a href="/liked" className="text-[#1DB954] hover:text-[#1ed760] text-sm font-semibold transition">
                  View all
                </a>
              </div>
              <div className="space-y-2">
                {tracks
                  .filter((t) => favorites.has(t.id))
                  .slice(0, 5)
                  .map((track, idx) => (
                    <motion.div
                      key={`fav-${track.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onMouseEnter={() => setHoveredTrack(track.id)}
                      onMouseLeave={() => setHoveredTrack(null)}
                      className="group flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-[#1DB954]/10 to-transparent hover:bg-gradient-to-r hover:from-[#1DB954]/20 hover:to-transparent transition duration-200"
                    >
                      {track.cover && (
                        <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={track.cover}
                            alt={track.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%231DB954" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="50" fill="white" text-anchor="middle" dy=".3em"%3E♪%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{track.title}</p>
                        <p className="text-white/60 text-xs truncate">{track.artist}</p>
                      </div>
                      {hoveredTrack === track.id && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => handleTrackPlay(track, tracks.indexOf(track))}
                          className="p-2 text-[#1DB954] hover:text-[#1ed760] transition"
                        >
                          <Play size={16} className="fill-current" />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
