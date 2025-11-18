'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Track = {
  id: string;
  title: string;
  artist?: string;
  src: string;
  album?: string;
  cover?: string;
  duration?: number;
};

export type PlaylistMode = 'all' | 'liked' | 'playlist';

type MusicContextType = {
  // Player State
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  
  // Playlist State
  playlist: Track[];
  playlistMode: PlaylistMode;
  favorites: Set<string>;
  
  // Actions
  setCurrentTrackIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setPlaylist: (tracks: Track[], mode: PlaylistMode) => void;
  toggleFavorite: (trackId: string) => void;
  addFavorite: (trackId: string) => void;
  removeFavorite: (trackId: string) => void;
  getCurrentTrack: () => Track | null;
  playNext: () => void;
  playPrevious: () => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylistState] = useState<Track[]>([]);
  const [playlistMode, setPlaylistMode] = useState<PlaylistMode>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aura_favorites');
    if (saved) {
      try {
        setFavorites(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('aura_favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const setPlaylist = useCallback((tracks: Track[], mode: PlaylistMode) => {
    setPlaylistState(tracks);
    setPlaylistMode(mode);
    setCurrentTrackIndex(0);
    setProgress(0);
  }, []);

  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites((prev) => {
      const newFav = new Set(prev);
      if (newFav.has(trackId)) {
        newFav.delete(trackId);
      } else {
        newFav.add(trackId);
      }
      return newFav;
    });
  }, []);

  const addFavorite = useCallback((trackId: string) => {
    setFavorites((prev) => new Set([...prev, trackId]));
  }, []);

  const removeFavorite = useCallback((trackId: string) => {
    setFavorites((prev) => {
      const newFav = new Set(prev);
      newFav.delete(trackId);
      return newFav;
    });
  }, []);

  const getCurrentTrack = useCallback(() => {
    return playlist[currentTrackIndex] || null;
  }, [playlist, currentTrackIndex]);

  const playNext = useCallback(() => {
    if (playlist.length > 0) {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    }
  }, [playlist.length]);

  const playPrevious = useCallback(() => {
    if (playlist.length > 0) {
      setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  }, [playlist.length]);

  const value: MusicContextType = {
    currentTrackIndex,
    isPlaying,
    volume,
    progress,
    duration,
    playlist,
    playlistMode,
    favorites,
    setCurrentTrackIndex,
    setIsPlaying,
    setVolume,
    setProgress,
    setDuration,
    setPlaylist,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    getCurrentTrack,
    playNext,
    playPrevious,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusicContext() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within MusicProvider');
  }
  return context;
}
