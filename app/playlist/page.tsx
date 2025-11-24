'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal, Share2, Download, Clock } from 'lucide-react';
import Sidebar from '@/app/components/Sidebar';
import { useMusicContext, type Track } from '@/app/context/MusicContext';

export default function PlaylistPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState('Chill Mix');

  const { favorites, toggleFavorite, setPlaylist, setIsPlaying } = useMusicContext();

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const response = await fetch('/api/deezer?action=trending&limit=50');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        const deezerTracks = (data.data || []).map((track: any, idx: number) => ({
          id: track.id ? `deezer-${track.id}` : `dz-${idx}`,
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
      }
    };
    loadTracks();
  }, []);

  const handlePlaylistPlay = () => {
    setPlaylist(tracks, 'playlist');
    setIsPlaying(true);
  };

  const handleTrackPlay = (trackIndex: number) => {
    setPlaylist(tracks, 'playlist');
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '3:45';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = tracks.reduce((acc, track) => acc + (track.duration || 225), 0);
  const playlistStats = {
    songs: tracks.length,
    duration: formatDuration(totalDuration),
    followers: Math.floor(Math.random() * 100000) + 1000
  };

  return (
    <div className="flex w-full min-h-screen bg-black">
      <Sidebar />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 ml-[320px] pb-32"
      >
        {/* Gradient Header Background */}
        <div className="relative h-80 bg-gradient-to-b from-[#1DB954]/40 via-[#1DB954]/20 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />

          {/* Header Content */}
          <div className="relative z-20 pt-16 px-8 h-full flex flex-col justify-end pb-8">
            <div className="flex items-end gap-8">
              {/* Playlist Cover */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-48 h-48 rounded-lg shadow-2xl overflow-hidden flex-shrink-0"
              >
                <div className="w-full h-full bg-gradient-to-br from-[#1DB954] to-blue-500 flex items-center justify-center">
                  <span className="text-7xl">♪</span>
                </div>
              </motion.div>

              {/* Playlist Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">Playlist</span>
                <h1 className="text-6xl font-bold text-white mb-4 leading-tight">{selectedPlaylist}</h1>
                <p className="text-white/70 text-lg mb-6">
                  {playlistStats.songs} songs • {playlistStats.duration} • {playlistStats.followers.toLocaleString()} followers
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlaylistPlay}
                    className="px-8 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold flex items-center gap-2 transition-all duration-200"
                  >
                    <Play size={20} className="fill-current" />
                    Play
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full border border-white/30 hover:border-white text-white/70 hover:text-white transition"
                  >
                    <Heart size={24} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full border border-white/30 hover:border-white text-white/70 hover:text-white transition"
                  >
                    <Share2 size={24} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full border border-white/30 hover:border-white text-white/70 hover:text-white transition"
                  >
                    <Download size={24} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Tracks Section */}
        <div className="px-8 py-8">
          {/* Column Headers */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 px-4 py-4 mb-2 text-white/60 text-sm font-semibold border-b border-white/10"
          >
            <div className="w-8 text-center">#</div>
            <div className="flex-1">TITLE</div>
            <div className="w-32">ALBUM</div>
            <div className="w-20 flex items-center gap-1">
              <Clock size={16} />
              <span>DURATION</span>
            </div>
            <div className="w-12" />
          </motion.div>

          {/* Tracks List */}
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
                className="group flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition duration-200 cursor-pointer"
              >
                {/* Track Number / Play Button */}
                <div className="w-8 text-center">
                  {hoveredTrack === track.id ? (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => handleTrackPlay(index)}
                      className="text-[#1DB954]"
                    >
                      <Play size={16} className="fill-current mx-auto" />
                    </motion.button>
                  ) : (
                    <span className="text-white/60 text-sm">{index + 1}</span>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{track.title}</p>
                  <p className="text-white/60 text-sm truncate">{track.artist || 'Unknown Artist'}</p>
                </div>

                {/* Album */}
                <div className="w-32 text-white/60 text-sm truncate">{track.album || 'Unknown'}</div>

                {/* Duration */}
                <div className="w-20 text-white/60 text-sm">{formatDuration(track.duration)}</div>

                {/* Action Buttons */}
                <div className="w-12 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleFavorite(track.id)}
                    className="p-2 rounded-full hover:bg-white/20 transition"
                  >
                    <Heart
                      size={16}
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
                    <MoreHorizontal size={16} className="text-white/60" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {tracks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-16"
            >
              <div className="text-center">
                <div className="text-7xl mb-4">♪</div>
                <div className="text-white/60 text-lg">No tracks in this playlist</div>
                <div className="text-white/40 text-sm mt-2">Add songs to get started</div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
