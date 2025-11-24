'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Music, Play, Plus, X, Trash2, Copy, Check } from 'lucide-react';
import Sidebar from '@/app/components/Sidebar';
import { ToastContainer, useToast } from '@/app/components/Toast';
import { useMusicContext, type Track } from '@/app/context/MusicContext';

type Playlist = {
  id: string;
  name: string;
  color: string;
  trackIds: string[];
  createdAt: number;
};

const colors = [
  'from-blue-500 to-blue-700',
  'from-pink-500 to-pink-700',
  'from-purple-500 to-purple-700',
  'from-green-500 to-green-700',
  'from-indigo-500 to-indigo-700',
  'from-orange-500 to-orange-700',
  'from-red-500 to-red-700',
  'from-cyan-500 to-cyan-700',
];

export default function LibraryPage() {
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'recent'>('playlists');
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { favorites, setPlaylist, setCurrentTrackIndex, setIsPlaying } = useMusicContext();
  const { toasts, showToast, removeToast } = useToast();

  // Load data from Deezer API and localStorage
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch('/api/deezer?action=trending&limit=50')
        .then((res) => res.json())
        .then((data) => {
          const tracks = data.data?.map((track: any, idx: number) => ({
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
          setAllTracks(tracks);
        })
        .catch((err) => {
          console.error('Failed to load tracks from Deezer API:', err);
          showToast('Failed to load tracks. Please refresh.', 'error');
        }),
      new Promise<void>((resolve) => {
        const saved = localStorage.getItem('aura_playlists');
        if (saved) {
          try {
            setPlaylists(JSON.parse(saved));
          } catch (e) {
            console.error('Failed to load playlists:', e);
          }
        }
        resolve();
      }),
    ]).finally(() => setIsLoading(false));
  }, [showToast]);

  // Save playlists to localStorage
  useEffect(() => {
    localStorage.setItem('aura_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const likedTracks = allTracks.filter((t) => favorites.has(t.id));

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) {
      showToast('Please enter a playlist name', 'info');
      return;
    }

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName,
      color: colors[Math.floor(Math.random() * colors.length)],
      trackIds: [],
      createdAt: Date.now(),
    };

    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
    setIsCreatingPlaylist(false);
    showToast(`✨ Playlist "${newPlaylist.name}" created!`, 'success');
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId(null);
      setShowAddTrackModal(false);
    }
  };

  const addTrackToPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(
      playlists.map((p) =>
        p.id === playlistId && !p.trackIds.includes(trackId)
          ? { ...p, trackIds: [...p.trackIds, trackId] }
          : p
      )
    );
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(
      playlists.map((p) =>
        p.id === playlistId
          ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) }
          : p
      )
    );
  };

  const handlePlayAll = () => {
    if (activeTab === 'liked' && likedTracks.length > 0) {
      setPlaylist(likedTracks, 'liked');
      setIsPlaying(true);
    } else if (activeTab === 'playlists' && selectedPlaylistId) {
      const playlist = playlists.find((p) => p.id === selectedPlaylistId);
      if (playlist) {
        const playlistTracks = allTracks.filter((t) => playlist.trackIds.includes(t.id));
        setPlaylist(playlistTracks, 'playlist');
        setIsPlaying(true);
      }
    }
  };

  const handleTrackPlay = (trackIndex: number, tracks: Track[]) => {
    setPlaylist(tracks, activeTab === 'liked' ? 'liked' : 'playlist');
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
  };

  const getPlaylistTracks = (playlistId: string) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return [];
    return allTracks.filter((t) => playlist.trackIds.includes(t.id));
  };

  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);
  const selectedPlaylistTracks = selectedPlaylist ? getPlaylistTracks(selectedPlaylist.id) : [];

  const tabs = [
    { id: 'playlists', label: 'Playlists', icon: <Music size={20} /> },
    { id: 'liked', label: 'Liked Songs', icon: <Heart size={20} /> },
    { id: 'recent', label: 'Recently Played', icon: <Clock size={20} /> },
  ];

  return (
    <div className="flex w-full min-h-screen bg-black">
      <Sidebar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 ml-[320px] pb-32"
      >
        <div className="relative h-80 bg-gradient-to-b from-[#1DB954]/50 via-[#1DB954]/20 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1DB954] rounded-full mix-blend-screen blur-3xl" />
          </div>
          <div className="relative z-20 pt-16 px-8 h-full flex flex-col justify-end pb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl font-bold text-white mb-3">Your Library</h1>
              <p className="text-white/70 text-lg">Create, organize & enjoy your favorite music</p>
            </motion.div>
          </div>
        </div>

        <div className="sticky top-0 z-40 px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-md flex gap-3 flex-wrap">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedPlaylistId(null);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#1DB954] to-[#1ed760] text-black shadow-lg shadow-[#1DB954]/30'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="px-8 py-12">
          {activeTab === 'playlists' && !selectedPlaylistId && (
            <>
              <div className="flex justify-between items-center mb-10">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-4xl font-bold text-white mb-2">Your Playlists</h2>
                  <p className="text-white/50">{playlists.length} playlist{playlists.length !== 1 ? 's' : ''}</p>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreatingPlaylist(true)}
                  className="px-8 py-3 bg-gradient-to-r from-[#1DB954] to-[#1ed760] hover:shadow-lg hover:shadow-[#1DB954]/30 text-black font-bold rounded-full transition flex items-center gap-2"
                >
                  <Plus size={18} /> Create Playlist
                </motion.button>
              </div>

              {isCreatingPlaylist && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setIsCreatingPlaylist(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gradient-to-b from-[#404040] to-[#282828] rounded-xl p-8 w-full max-w-md shadow-2xl border border-white/10"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-3xl font-bold text-white">Create Playlist</h3>
                      <motion.button
                        whileHover={{ rotate: 90 }}
                        onClick={() => setIsCreatingPlaylist(false)}
                        className="text-white/60 hover:text-white transition"
                      >
                        <X size={24} />
                      </motion.button>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter playlist name..."
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
                      autoFocus
                      className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20 focus:outline-none mb-6 transition"
                    />
                    <div className="flex gap-3 justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsCreatingPlaylist(false)}
                        className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={createPlaylist}
                        disabled={!newPlaylistName.trim()}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-[#1DB954] to-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold transition"
                      >
                        Create
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {playlists.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-32"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Music size={120} className="text-white/10 mx-auto mb-6" />
                    </motion.div>
                    <div className="text-white/60 text-2xl font-semibold mb-2">No playlists yet</div>
                    <div className="text-white/40 text-base mb-6">Start creating playlists to organize your music</div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsCreatingPlaylist(true)}
                      className="px-8 py-3 bg-gradient-to-r from-[#1DB954] to-[#1ed760] text-black font-bold rounded-full transition"
                    >
                      Create First Playlist
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {playlists.map((playlist, idx) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="group bg-gradient-to-b from-white/10 to-white/5 rounded-xl overflow-hidden hover:from-white/20 hover:to-white/10 transition cursor-pointer backdrop-blur-sm border border-white/10 hover:border-white/20"
                    >
                      <div className={`h-48 bg-gradient-to-br ${playlist.color} flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-black/40" />
                        <Music size={56} className="text-white/80 relative z-10" />
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          onClick={() => setSelectedPlaylistId(playlist.id)}
                          className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-[#1DB954] to-[#1ed760] hover:shadow-lg hover:shadow-[#1DB954]/50 rounded-full transition transform hover:scale-110 z-50"
                        >
                          <Play size={20} className="text-black fill-current" />
                        </motion.button>
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-white truncate text-lg mb-1">{playlist.name}</h3>
                        <p className="text-white/50 text-sm mb-4">{playlist.trackIds.length} songs</p>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPlaylistId(playlist.id)}
                            className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition flex items-center justify-center gap-1"
                          >
                            <Music size={14} /> View
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => deletePlaylist(playlist.id)}
                            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'playlists' && selectedPlaylistId && selectedPlaylist && (
            <>
              <div className="flex items-center gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPlaylistId(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
                >
                  ← Back
                </motion.button>
                <h2 className="text-2xl font-bold text-white">{selectedPlaylist.name}</h2>
              </div>

              <div className="flex justify-between items-center mb-8">
                <p className="text-white/60">{selectedPlaylistTracks.length} songs</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlayAll}
                    disabled={selectedPlaylistTracks.length === 0}
                    className="px-6 py-2 bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-bold rounded-full transition flex items-center gap-2"
                  >
                    <Play size={16} className="fill-current" /> Play All
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddTrackModal(true)}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Songs
                  </motion.button>
                </div>
              </div>

              {showAddTrackModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  onClick={() => setShowAddTrackModal(false)}
                >
                  <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#282828] rounded-lg w-full max-w-2xl max-h-96 overflow-y-auto shadow-2xl"
                  >
                    <div className="sticky top-0 bg-[#282828] p-6 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-white">Add Songs to {selectedPlaylist.name}</h3>
                      <button
                        onClick={() => setShowAddTrackModal(false)}
                        className="text-white/60 hover:text-white"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <div className="p-6 space-y-2">
                      {allTracks.map((track) => (
                        <div
                          key={track.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition"
                        >
                          <div className="flex-1">
                            <p className="text-white font-medium">{track.title}</p>
                            <p className="text-white/60 text-sm">{track.artist}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (selectedPlaylist.trackIds.includes(track.id)) {
                                removeTrackFromPlaylist(selectedPlaylist.id, track.id);
                              } else {
                                addTrackToPlaylist(selectedPlaylist.id, track.id);
                              }
                            }}
                            className={`px-4 py-1 rounded-full font-semibold text-sm transition ${
                              selectedPlaylist.trackIds.includes(track.id)
                                ? 'bg-[#1DB954] text-black'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                          >
                            {selectedPlaylist.trackIds.includes(track.id) ? '✓ Added' : 'Add'}
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {selectedPlaylistTracks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-24"
                >
                  <div className="text-center">
                    <Music size={80} className="text-white/20 mx-auto mb-4" />
                    <div className="text-white/60 text-xl">No songs in this playlist</div>
                    <div className="text-white/40 text-sm">Add songs to get started</div>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-1">
                  {selectedPlaylistTracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onMouseEnter={() => setHoveredTrack(track.id)}
                      onMouseLeave={() => setHoveredTrack(null)}
                      className="group flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition"
                    >
                      <div className="w-10 text-right text-white/60 text-sm group-hover:hidden">{index + 1}</div>
                      {hoveredTrack === track.id && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          onClick={() => handleTrackPlay(index, selectedPlaylistTracks)}
                          className="w-10 text-[#1DB954]"
                        >
                          <Play size={16} className="fill-current mx-auto" />
                        </motion.button>
                      )}

                      {track.cover && (
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.png';
                          }}
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{track.title}</p>
                        <p className="text-white/60 text-sm truncate">{track.artist || 'Unknown Artist'}</p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeTrackFromPlaylist(selectedPlaylist.id, track.id)}
                        className="p-2 rounded-full hover:bg-white/20 text-white/60 hover:text-white transition"
                      >
                        <X size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'liked' && (
            <>
              <div className="flex justify-between items-center mb-10">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-4xl font-bold text-white mb-2">Liked Songs</h2>
                  <p className="text-white/50">{likedTracks.length} songs • {formatDuration(likedTracks.reduce((acc, t) => acc + (t.duration || 0), 0))}</p>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayAll}
                  disabled={likedTracks.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-[#1DB954] to-[#1ed760] hover:shadow-lg hover:shadow-[#1DB954]/30 disabled:opacity-50 text-black font-bold rounded-full transition flex items-center gap-2"
                >
                  <Play size={18} className="fill-current" /> Play All
                </motion.button>
              </div>

              {likedTracks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-32"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart size={120} className="text-white/10 mx-auto mb-6" />
                    </motion.div>
                    <div className="text-white/60 text-2xl font-semibold mb-2">No liked songs yet</div>
                    <div className="text-white/40 text-base">Like songs while listening to build your collection</div>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-1">
                  {likedTracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onMouseEnter={() => setHoveredTrack(track.id)}
                      onMouseLeave={() => setHoveredTrack(null)}
                      className="group flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition"
                    >
                      <div className="w-10 text-right text-white/60 text-sm group-hover:hidden">{index + 1}</div>
                      {hoveredTrack === track.id && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          onClick={() => handleTrackPlay(index, likedTracks)}
                          className="w-10 text-[#1DB954]"
                        >
                          <Play size={16} className="fill-current mx-auto" />
                        </motion.button>
                      )}

                      {track.cover && (
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.png';
                          }}
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{track.title}</p>
                        <p className="text-white/60 text-sm truncate">{track.artist || 'Unknown Artist'}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'recent' && (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock size={120} className="text-white/10 mx-auto mb-6" />
                </motion.div>
                <div className="text-white/60 text-2xl font-semibold mb-2">No recently played songs</div>
                <div className="text-white/40 text-base">Start playing music to see your history</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
