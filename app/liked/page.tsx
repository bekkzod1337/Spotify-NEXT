'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, MoreHorizontal, Share2, Download, Clock, Copy, Check } from 'lucide-react';
import Sidebar from '@/app/components/Sidebar';
import { useMusicContext, type Track } from '@/app/context/MusicContext';

export default function LikedPage() {
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [copiedTrack, setCopiedTrack] = useState<string | null>(null);
  const [filterGenre, setFilterGenre] = useState<string>('all');

  const { favorites, toggleFavorite, setPlaylist, setCurrentTrackIndex, setIsPlaying } = useMusicContext();

  useEffect(() => {
    const loadLikedTracks = async () => {
      setIsLoading(true);
      try {
        // Load all trending tracks from Deezer
        const response = await fetch('/api/deezer?action=trending&limit=100');
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        const allDeezerTracks = (data.data || []).map((track: any) => ({
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

        // Filter to only liked tracks
        const liked = allDeezerTracks.filter((t: Track) => favorites.has(t.id));
        setLikedTracks(liked);
      } catch (error) {
        console.error('Error loading liked tracks:', error);
        setLikedTracks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLikedTracks();
  }, [favorites]);

  // Sort liked tracks
  const sortedLikedTracks = [...likedTracks].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'oldest') {
      return (a.id?.localeCompare(b.id || '') || 0);
    }
    return 0;
  });

  // Get unique genres/artists
  const uniqueGenres = ['all', ...new Set(likedTracks.map(t => t.artist || 'Unknown'))].slice(0, 6);

  const filteredTracks = filterGenre === 'all' ? sortedLikedTracks : sortedLikedTracks.filter(t => t.artist === filterGenre);

  const handlePlayAll = () => {
    if (filteredTracks.length > 0) {
      setPlaylist(filteredTracks, 'liked');
      setIsPlaying(true);
    }
  };

  const handleTrackPlay = (trackIndex: number) => {
    setPlaylist(filteredTracks, 'liked');
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
  };

  const copyShareLink = (trackId: string) => {
    setCopiedTrack(trackId);
    navigator.clipboard.writeText(`${window.location.origin}/liked?track=${trackId}`);
    setTimeout(() => setCopiedTrack(null), 2000);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '3:45';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalDuration = (seconds?: number) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const totalDuration = filteredTracks.reduce((acc, track) => acc + (track.duration || 225), 0);


  return (
    <div className="flex w-full min-h-screen bg-black">
      <Sidebar />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 ml-[320px] pb-32 overflow-y-auto"
      >
        {/* Animated Gradient Header Background */}
        <motion.div
          className="relative h-96 bg-gradient-to-b from-[#1DB954]/50 via-[#1DB954]/20 to-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-[#1DB954] rounded-full blur-3xl opacity-20"
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          {/* Header Content */}
          <div className="relative z-20 pt-16 px-8 h-full flex flex-col justify-end pb-8">
            <div className="flex items-end gap-8">
              {/* Liked Songs Cover */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="w-56 h-56 rounded-xl shadow-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#1DB954] to-[#1ed760] flex items-center justify-center relative"
              >
                <div className="absolute inset-0 bg-black/20" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Heart size={100} className="text-white fill-white drop-shadow-lg" />
                </motion.div>
              </motion.div>

              {/* Playlist Info */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className="text-[#1DB954] font-bold text-sm uppercase tracking-widest drop-shadow-lg">♥ Liked Songs</span>
                <h1 className="text-7xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                  {filteredTracks.length === 0 ? 'No Songs' : 'Your Favorites'}
                </h1>
                <p className="text-white/80 text-lg mb-8 font-medium">
                  {filteredTracks.length} {filteredTracks.length === 1 ? 'song' : 'songs'} • {formatTotalDuration(totalDuration)}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handlePlayAll}
                    disabled={filteredTracks.length === 0}
                    className="px-10 py-4 rounded-full bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center gap-3 transition-all duration-200 shadow-xl hover:shadow-2xl"
                  >
                    <Play size={24} className="fill-current" />
                    Play All
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 rounded-full border-2 border-white/40 hover:border-white text-white/70 hover:text-white transition-all duration-200"
                  >
                    <Share2 size={24} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 rounded-full border-2 border-white/40 hover:border-white text-white/70 hover:text-white transition-all duration-200"
                  >
                    <Download size={24} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Filter and Controls */}
        <div className="sticky top-0 z-40 px-8 py-6 bg-gradient-to-b from-black via-black/95 to-transparent backdrop-blur-md border-b border-white/10">
          {likedTracks.length > 0 && (
            <div className="space-y-4">
              {/* Filter by Artist */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {uniqueGenres.map((genre) => (
                  <motion.button
                    key={genre}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterGenre(genre)}
                    className={`px-6 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                      filterGenre === genre
                        ? 'bg-[#1DB954] text-black shadow-lg'
                        : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {genre === 'all' ? 'All Songs' : genre}
                  </motion.button>
                ))}
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-4">
                <span className="text-white/60 text-sm font-semibold">Sort:</span>
                <div className="flex items-center gap-2">
                  {(['newest', 'oldest', 'title'] as const).map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSortBy(option)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                        sortBy === option
                          ? 'bg-[#1DB954] text-black'
                          : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tracks Section */}
        <div className="px-8 py-8">
          {filteredTracks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center py-32"
            >
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart size={100} className="text-white/20 mx-auto mb-6" />
                </motion.div>
                <div className="text-white/70 text-2xl font-bold mb-3">
                  {likedTracks.length === 0 ? 'No liked songs yet' : 'No results found'}
                </div>
                <div className="text-white/40 text-base">
                  {likedTracks.length === 0
                    ? 'Like songs to add them to your collection'
                    : 'Try adjusting your filters'}
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Column Headers */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-12 gap-4 px-4 py-3 mb-2 text-white/50 text-xs font-bold uppercase tracking-wider border-b border-white/10"
              >
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4">Title</div>
                <div className="col-span-3">Artist</div>
                <div className="col-span-2 flex items-center gap-1">
                  <Clock size={14} />
                  <span>Duration</span>
                </div>
                <div className="col-span-2" />
              </motion.div>

              {/* Tracks List */}
              <div className="space-y-1">
                <AnimatePresence>
                  {filteredTracks.map((track, index) => (
                    <motion.div
                      key={`${track.id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                      onMouseEnter={() => setHoveredTrack(track.id)}
                      onMouseLeave={() => setHoveredTrack(null)}
                      className="group grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg hover:bg-white/10 transition duration-200 cursor-pointer"
                    >
                      {/* Track Number / Play Button */}
                      <div className="col-span-1 text-center">
                        {hoveredTrack === track.id ? (
                          <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            onClick={() => handleTrackPlay(filteredTracks.indexOf(track))}
                            className="text-[#1DB954] flex justify-center"
                          >
                            <Play size={18} className="fill-current" />
                          </motion.button>
                        ) : (
                          <span className="text-white/50 text-sm font-medium">{index + 1}</span>
                        )}
                      </div>

                      {/* Track Info with Cover */}
                      <div className="col-span-4 flex items-center gap-4 min-w-0">
                        {track.cover && (
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={track.cover}
                            alt={track.title}
                            className="w-12 h-12 rounded-md object-cover shadow-lg flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Crect fill="%231DB954" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="white" text-anchor="middle" dy=".3em"%3E♪%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-semibold truncate group-hover:text-[#1DB954] transition">
                            {track.title}
                          </p>
                          <p className="text-white/50 text-xs truncate">{track.album || 'Unknown Album'}</p>
                        </div>
                      </div>

                      {/* Artist */}
                      <div className="col-span-3 text-white/60 text-sm truncate">
                        {track.artist || 'Unknown Artist'}
                      </div>

                      {/* Duration */}
                      <div className="col-span-2 text-white/60 text-sm">{formatDuration(track.duration)}</div>

                      {/* Action Buttons */}
                      <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyShareLink(track.id)}
                          className="p-2 rounded-full hover:bg-white/20 transition"
                          title="Share"
                        >
                          {copiedTrack === track.id ? (
                            <Check size={16} className="text-[#1DB954]" />
                          ) : (
                            <Copy size={16} className="text-white/60 hover:text-white" />
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleFavorite(track.id)}
                          className="p-2 rounded-full hover:bg-white/20 transition"
                          title="Remove from liked"
                        >
                          <Heart size={16} className="fill-[#1DB954] text-[#1DB954]" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full hover:bg-white/20 transition"
                          title="More options"
                        >
                          <MoreHorizontal size={16} className="text-white/60 hover:text-white" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
