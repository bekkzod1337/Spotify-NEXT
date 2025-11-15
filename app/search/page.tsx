'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

type Track = {
  id: string;
  title: string;
  artist?: string;
  src: string;
  album?: string;
  cover?: string;
};

export default function SearchPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/musics/manifest.json')
      .then((res) => res.json())
      .then((data) => setTracks(data.tracks || []))
      .catch(() => setTracks([]));
  }, []);

  const filteredTracks = tracks.filter(
    (t) =>
      !query ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-gradient-to-b from-[#004b63]/80 to-[#0bbcd6]/80 p-8 flex flex-col items-center"
    >
      <h1 className="text-3xl md:text-4xl text-white font-extrabold mb-6 drop-shadow-lg">
        Search Music
      </h1>

      {/* Search Input */}
      <div className="relative w-full max-w-xl mb-8">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
        <input
          type="text"
          placeholder="Search tracks, artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition"
        />
      </div>

      {/* Track List */}
      <ul className="w-full max-w-xl divide-y divide-white/20 overflow-y-auto rounded-2xl">
        {filteredTracks.length === 0 && (
          <li className="py-4 text-center text-white/60">No tracks found</li>
        )}

        {filteredTracks.map((track) => (
          <li
            key={track.id}
            className="flex items-center gap-4 p-4 hover:bg-white/10 transition rounded-xl cursor-pointer"
          >
            {track.cover && (
              <img
                src={track.cover}
                alt={track.title}
                className="w-12 h-12 rounded-md object-cover"
              />
            )}
            <div className="flex-1">
              <div className="text-white font-medium">{track.title}</div>
              <div className="text-white/60 text-sm">{track.artist}</div>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
