'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  Maximize2,
  X
} from 'lucide-react';
import { useMusicContext } from '@/app/context/MusicContext';

export default function MusicPlayer() {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    volume,
    progress,
    duration,
    favorites,
    setIsPlaying,
    setVolume,
    setProgress,
    setDuration,
    setCurrentTrackIndex,
    toggleFavorite,
    playNext,
    playPrevious,
  } = useMusicContext();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentTrack = playlist[currentTrackIndex];

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
      audioRef.current.volume = volume;

      audioRef.current.addEventListener('timeupdate', () => {
        if (!audioRef.current?.duration) return;
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      });

      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current?.duration) {
          setDuration(audioRef.current.duration);
        }
      });

      audioRef.current.addEventListener('ended', () => {
        if (repeatMode === 'one') {
          audioRef.current!.currentTime = 0;
          audioRef.current!.play();
        } else {
          handleNext();
        }
      });
    }
  }, [repeatMode, setProgress, setDuration]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Update track source when current track changes (auto-play functionality)
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    // Handle Deezer tracks with preview URL
    const audioSrc = currentTrack.src || currentTrack.preview;
    
    if (!audioSrc) {
      console.warn('No audio source available for track:', currentTrack);
      setIsPlaying(false);
      return;
    }

    audioRef.current.src = audioSrc;
    audioRef.current.load();

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    }
  }, [currentTrack, isPlaying, setIsPlaying]);

  // Keyboard shortcuts
  const [keyboardHint, setKeyboardHint] = useState<string | null>(null);
  const keyboardHintRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      let hint = '';

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          hint = isPlaying ? '⏸ Paused' : '▶ Playing';
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          hint = '⏭ Next Track';
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          hint = '⏮ Previous Track';
          break;
        case 'KeyM':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShuffle(!shuffle);
            hint = shuffle ? '🔀 Shuffle Off' : '🔀 Shuffle On';
          }
          break;
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const newMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
            setRepeatMode(newMode);
            hint = newMode === 'off' ? '🔁 Repeat Off' : newMode === 'all' ? '🔁 Repeat All' : '🔁 Repeat One';
          }
          break;
        case 'Slash':
          e.preventDefault();
          hint = '⌨️ Shortcuts Enabled';
          break;
      }

      if (hint) {
        setKeyboardHint(hint);
        if (keyboardHintRef.current) clearTimeout(keyboardHintRef.current);
        keyboardHintRef.current = setTimeout(() => setKeyboardHint(null), 1500);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (keyboardHintRef.current) clearTimeout(keyboardHintRef.current);
    };
  }, [isPlaying, shuffle, repeatMode]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleNext = () => {
    if (shuffle && playlist.length > 0) {
      setCurrentTrackIndex(Math.floor(Math.random() * playlist.length));
    } else {
      playNext();
    }
  };

  const handlePrev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      playPrevious();
    }
  };

  const handleSeek = (pct: number) => {
    if (!audioRef.current?.duration) return;
    audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
    setProgress(pct);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack || playlist.length === 0) {
    return null;
  }

  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black"
      >
        {/* Video Background */}
        <div className="absolute inset-0 -z-20">
          <video
            className="w-full h-full object-cover filter brightness-50 contrast-125"
            src="/1.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
        </div>

        {/* Fullscreen Player */}
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white relative">
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFullscreen(false)}
            className="absolute top-8 right-8 p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <X size={24} />
          </motion.button>

          {/* Album Art */}
          <motion.img
            src={currentTrack.cover || '/logo.png'}
            alt={currentTrack.title}
            className="w-64 h-64 rounded-2xl object-cover shadow-2xl mb-8"
            animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
          />

          {/* Track Info */}
          <h1 className="text-5xl font-bold mb-2 text-center">{currentTrack.title || 'No Track'}</h1>
          <p className="text-2xl text-white/80 mb-8">{currentTrack.artist || ''}</p>

          {/* Progress and Time */}
          <div className="w-full max-w-2xl mb-6">
            <div
              className="h-1 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer mb-2"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleSeek(((e.clientX - rect.left) / rect.width) * 100);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-[#1DB954] to-[#1ed760]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-white/70">
              <span>{formatTime((progress / 100) * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
              className={`p-3 rounded-full transition ${
                repeatMode !== 'off' ? 'bg-[#1DB954] text-white' : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {repeatMode === 'one' ? <Repeat1 size={24} /> : <Repeat size={24} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <SkipBack size={28} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={togglePlay}
              className="p-6 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black transition-all shadow-xl"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <SkipForward size={28} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShuffle(!shuffle)}
              className={`p-3 rounded-full transition ${
                shuffle ? 'bg-[#1DB954] text-white' : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Shuffle size={24} />
            </motion.button>
          </div>

          {/* Volume */}
          <div className="mt-10 flex items-center gap-4 w-full max-w-xs">
            <Volume2 size={20} className="text-white/70" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-[#1DB954] cursor-pointer"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/95 to-black/80 border-t border-white/10 text-white"
    >
      {/* Progress Bar */}
      <div
        className="h-1 w-full bg-white/10 cursor-pointer hover:bg-white/20 transition group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handleSeek(((e.clientX - rect.left) / rect.width) * 100);
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-[#1DB954] to-[#1ed760]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Player */}
      <div className="px-8 py-4">
        <div className="max-w-full">
          {/* Now Playing & Controls - Grid Layout */}
          <div className="grid grid-cols-3 gap-6 items-center h-16">
            {/* Left: Track Info */}
            <div className="flex items-center gap-4 min-w-0 w-full">
              {currentTrack.cover && (
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0 shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate text-white">{currentTrack.title || 'No Track'}</div>
                <div className="text-xs text-white/60 truncate">{currentTrack.artist || 'Unknown Artist'}</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleFavorite(currentTrack.id)}
                className="p-2 rounded-full hover:bg-white/10 transition flex-shrink-0"
              >
                <Heart
                  size={18}
                  className={`transition-colors ${favorites.has(currentTrack.id) ? 'fill-[#1DB954] text-[#1DB954]' : 'text-white/60 hover:text-white'}`}
                />
              </motion.button>
            </div>

            {/* Center: Playback Controls */}
            <div className="flex justify-center items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
                className={`p-2 rounded-full transition ${
                  repeatMode !== 'off' ? 'bg-white/10 text-[#1DB954]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                className="p-2 rounded-full text-white/80 hover:text-white transition hover:bg-white/5"
              >
                <SkipBack size={18} fill="currentColor" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={togglePlay}
                className="p-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black transition-all shadow-lg hover:shadow-xl"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="p-2 rounded-full text-white/80 hover:text-white transition hover:bg-white/5"
              >
                <SkipForward size={18} fill="currentColor" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 rounded-full transition ${
                  shuffle ? 'bg-white/10 text-[#1DB954]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shuffle size={18} />
              </motion.button>
            </div>

            {/* Right: Volume & Info */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-36">
                <Volume2 size={16} className="text-white/60 flex-shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 accent-[#1DB954] h-1 cursor-pointer"
                />
                <span className="text-xs text-white/60 w-8 text-right">{Math.round(volume * 100)}</span>
              </div>
              <div className="text-xs text-white/60 w-12 text-right font-mono">
                {formatTime((progress / 100) * duration)}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(true)}
                className="p-2 rounded-full text-white/60 hover:text-white transition hover:bg-white/10"
              >
                <Maximize2 size={18} />
              </motion.button>
            </div>
          </div>

          {/* Keyboard Hint Tooltip */}
          <AnimatePresence>
            {keyboardHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-[#1DB954] text-black px-4 py-2 rounded-lg font-semibold text-sm z-50 whitespace-nowrap"
              >
                {keyboardHint}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
