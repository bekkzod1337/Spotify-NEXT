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

  // Load data from localStorage and manifest
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch('/musics/manifest.json')
        .then((res) => res.json())
        .then((data) => setAllTracks(data.tracks || []))
        .catch((err) => {
          console.error('Failed to load tracks:', err);
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
  }, []);

  // Save playlists to localStorage
  useEffect(() => {
    localStorage.setItem('aura_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const likedTracks = allTracks.filter((t) => favorites.has(t.id));

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
        <div className="relative h-64 bg-gradient-to-b from-[#1DB954]/40 via-[#1DB954]/20 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
          <div className="relative z-20 pt-12 px-8 h-full flex flex-col justify-end pb-6">
            <h1 className="text-5xl font-bold text-white mb-2">Your Library</h1>
            <p className="text-white/70">Manage and organize your music</p>
          </div>
        </div>

        <div className="px-8 py-6 border-b border-white/10 flex gap-2 flex-wrap">
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
                  ? 'bg-[#1DB954] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="px-8 py-8">
          {activeTab === 'playlists' && !selectedPlaylistId && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreatingPlaylist(true)}
                  className="px-6 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition flex items-center gap-2"
                >
                  <Plus size={16} /> Create Playlist
                </motion.button>
              </div>

              {isCreatingPlaylist && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                  onClick={() => setIsCreatingPlaylist(false)}
                >
                  <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#282828] rounded-lg p-6 w-96 shadow-2xl"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-white">Create Playlist</h3>
                      <button
                        onClick={() => setIsCreatingPlaylist(false)}
                        className="text-white/60 hover:text-white"
                      >
                        <X size={24} />
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
                        className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={createPlaylist}
                        disabled={!newPlaylistName.trim()}
                        className="px-6 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-bold transition"
                      >
                        Create
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {playlists.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-24"
                >
                  <div className="text-center">
                    <Music size={80} className="text-white/20 mx-auto mb-4" />
                    <div className="text-white/60 text-xl">No playlists yet</div>
                    <div className="text-white/40 text-sm">Create your first playlist to get started</div>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playlists.map((playlist, idx) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="group bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition cursor-pointer"
                    >
                      <div className={`h-40 bg-gradient-to-br ${playlist.color} flex items-center justify-center relative`}>
                        <Music size={48} className="text-white/80" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />
                        <motion.button
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          onClick={() => setSelectedPlaylistId(playlist.id)}
                          className="absolute bottom-4 right-4 p-3 bg-[#1DB954] hover:bg-[#1ed760] rounded-full transition transform hover:scale-110 z-50"
                        >
                          <Play size={20} className="text-black fill-current" />
                        </motion.button>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-white truncate">{playlist.name}</h3>
                        <p className="text-white/60 text-sm mb-3">{playlist.trackIds.length} songs</p>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedPlaylistId(playlist.id)}
                            className="flex-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition flex items-center justify-center gap-1"
                          >
                            <Plus size={14} /> Add
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deletePlaylist(playlist.id)}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm rounded transition"
                          >
                            <Trash2 size={14} />
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
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Liked Songs</h2>
                  <p className="text-white/60">{likedTracks.length} songs</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayAll}
                  disabled={likedTracks.length === 0}
                  className="px-6 py-2 bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-bold rounded-full transition"
                >
                  <Play size={16} className="inline mr-2 fill-current" /> Play All
                </motion.button>
              </div>

              {likedTracks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-24"
                >
                  <div className="text-center">
                    <Heart size={80} className="text-white/20 mx-auto mb-4" />
                    <div className="text-white/60 text-xl">No liked songs yet</div>
                    <div className="text-white/40 text-sm">Like songs to add them to your collection</div>
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
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <Clock size={80} className="text-white/20 mx-auto mb-4" />
                <div className="text-white/60 text-xl">No recently played songs</div>
                <div className="text-white/40 text-sm">Start playing music to see your history</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
