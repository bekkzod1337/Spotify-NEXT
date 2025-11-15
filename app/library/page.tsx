'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Music, List } from 'lucide-react';

type Track = {
  id: string;
  title: string;
  artist?: string;
  src: string;
  album?: string;
  cover?: string;
};

export default function LibraryPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'recent' | 'albums'>('playlists');

  useEffect(() => {
    fetch('/musics/manifest.json')
      .then((res) => res.json())
      .then((data) => setTracks(data.tracks || []))
      .catch(() => setTracks([]));
  }, []);

  const tabs = [
    { id: 'playlists', label: 'Playlists', icon: <List size={20} /> },
    { id: 'liked', label: 'Liked Songs', icon: <Heart size={20} /> },
    { id: 'recent', label: 'Recently Played', icon: <Clock size={20} /> },
    { id: 'albums', label: 'Albums', icon: <Music size={20} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-gradient-to-b from-[#004b63]/80 to-[#0bbcd6]/80 p-8 flex flex-col"
    >
      <h1 className="text-3xl md:text-4xl text-white font-extrabold mb-6 drop-shadow-lg">
        Your Library
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#00f0ff]/50 to-[#008cff]/50 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            {tab.icon}
            <span className="font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-white/20 rounded-2xl">
          {tracks.length === 0 && (
            <li className="py-4 text-center text-white/60">No tracks available</li>
          )}

          {tracks.map((track) => (
            <li
              key={track.id}
              className="flex items-center gap-4 p-4 hover:bg-white/10 transition rounded-xl cursor-pointer"
            >
              {track.cover ? (
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-12 h-12 rounded-md object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-md bg-white/10 flex items-center justify-center">
                  <Music size={16} className="text-white/60" />
                </div>
              )}
              <div className="flex-1">
                <div className="text-white font-medium">{track.title}</div>
                <div className="text-white/60 text-sm">{track.artist}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
