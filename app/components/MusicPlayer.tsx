'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Search,
  ListMusic
} from 'lucide-react';

type Track = {
  id: string;
  title: string;
  artist?: string;
  src: string;
  album?: string;
  cover?: string;
};

export default function SpotifyMusicPlayer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/musics/manifest.json')
      .then((res) => res.json())
      .then((data) => setTracks(data.tracks || []))
      .catch(() => setTracks([]));
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
      audioRef.current.volume = volume;

      audioRef.current.addEventListener('timeupdate', () => {
        if (!audioRef.current?.duration) return;
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      });

      audioRef.current.addEventListener('ended', () => handleNext());
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const track = tracks[index];
    if (!track || !audioRef.current) return;

    audioRef.current.src = track.src;
    audioRef.current.load();

    if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
    setProgress(0);
  }, [index, tracks, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleNext = () => setIndex((i) => (tracks.length ? (i + 1) % tracks.length : 0));
  const handlePrev = () => setIndex((i) => (tracks.length ? (i - 1 + tracks.length) % tracks.length : 0));
  const handleSeek = (pct: number) => {
    if (!audioRef.current?.duration) return;
    audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
    setProgress(pct);
  };

  const filtered = tracks.filter(
    (t) =>
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 w-full max-w-md bg-gradient-to-br from-[#0bbcd6]/80 to-[#004b63]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_0_40px_#00eaff50] z-50"
    >
      {/* NOW PLAYING */}
      <div className="flex items-center gap-4 mb-4">
        {tracks[index]?.cover && (
          <img src={tracks[index].cover} alt={tracks[index].title} className="w-12 h-12 rounded-md object-cover" />
        )}
        <div className="flex-1">
          <div className="text-white font-semibold text-lg drop-shadow-lg">{tracks[index]?.title || 'No Track'}</div>
          <div className="text-xs text-white/70">{tracks[index]?.artist || ''}</div>
        </div>
        <ListMusic size={24} className="text-white/60 cursor-pointer hover:text-white transition" />
      </div>

      {/* CONTROLS */}
      <div className="flex justify-center items-center gap-4 mt-2">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-shadow duration-200 shadow-inner"
        >
          <SkipBack size={20} className="text-white/80" />
        </button>

        <button
          onClick={togglePlay}
          className="p-4 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#008cff] text-white shadow-[0_0_20px_#00eaff] hover:scale-105 transition-transform duration-200"
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>

        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-shadow duration-200 shadow-inner"
        >
          <SkipForward size={20} className="text-white/80" />
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div
        className="mt-4 h-2 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handleSeek(((e.clientX - rect.left) / rect.width) * 100);
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-[#00f0ff] to-[#00b3c6] shadow-[0_0_10px_#00eaff]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* VOLUME */}
      <div className="mt-5 flex items-center gap-3">
        <Volume2 className="text-white/80" size={18} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-40 accent-[#00eaff]"
        />
      </div>

      {/* SEARCH */}
      <div className="mt-6 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
        <input
          type="text"
          placeholder="Search tracks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:bg-white/20 focus:outline-none transition"
        />
      </div>

      {/* TRACK LIST */}
      <ul className="mt-4 max-h-60 overflow-y-auto divide-y divide-white/10">
        {filtered.length === 0 && <li className="py-2 text-sm text-white/70">No tracks found</li>}

        {filtered.map((t) => {
          const active = tracks[index]?.id === t.id;
          return (
            <li
              key={t.id}
              onClick={() => {
                const realIndex = tracks.findIndex((tt) => tt.id === t.id);
                if (realIndex >= 0) setIndex(realIndex);
                setIsPlaying(true);
              }}
              className={`px-3 py-2 rounded-md flex justify-between items-center cursor-pointer transition-all duration-200 ${
                active ? 'bg-gradient-to-r from-[#00f0ff]/30 to-[#008cff]/30 shadow-inner' : 'hover:bg-white/10'
              }`}
            >
              <div>
                <div className="text-white font-medium text-sm">{t.title}</div>
                <div className="text-white/60 text-xs">{t.artist}</div>
              </div>
              <Play size={14} className="text-white/50" />
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
