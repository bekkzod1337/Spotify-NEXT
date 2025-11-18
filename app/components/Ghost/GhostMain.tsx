'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Link from 'next/link';

type Track = {
  id: string;
  title: string;
  artist?: string;
  src: string;
  album?: string;
  cover?: string;
};

function GhostMain() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/musics/manifest.json')
      .then((res) => res.json())
      .then((data) => {
        setTracks(data.tracks || []);
        const uniqueArtists = Array.from(
          new Set(
            (data.tracks || [])
              .map((t: Track) => t.artist || 'Unknown')
              .filter((artist: string) => artist !== 'Unknown')
          )
        ) as string[];
        setArtists(uniqueArtists);
        setIsLoading(false);
      })
      .catch(() => {
        setTracks([]);
        setArtists([]);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="absolute top-22 left-[365px] w-[1110px] h-[680px] rounded-md bg-gradient-to-bl from-[#222222] to-[#121212] overflow-y-auto flex flex-col p-8">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-white/20 border-t-[#1DB954] rounded-full"
          />
        </div>
      ) : (
        <>
          {/* Trending Songs */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-2xl">Trending Songs</h2>
        <Link href="#" className="text-[#B3B3B3] hover:text-white transition text-sm font-semibold">
          Show all
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-6 mb-12">
        {tracks.slice(0, 5).map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredSong(song.id)}
            onMouseLeave={() => setHoveredSong(null)}
            className="group bg-[#1E1E1E] rounded-md p-4 hover:bg-[#282828] transition-all cursor-pointer relative"
          >
            {/* Song Cover */}
            <div className="relative mb-4 overflow-hidden rounded-md">
              <img
                src={song.cover || '/logo.png'}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-md group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              {hoveredSong === song.id && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-3 right-3 p-3 bg-[#1DB954] rounded-full hover:bg-[#1ed760] transition-all shadow-lg"
                >
                  <Play size={20} className="text-black fill-black" />
                </motion.button>
              )}
            </div>

            <p className="text-white font-semibold truncate mb-1">{song.title}</p>
            <p className="text-[#B3B3B3] text-sm truncate">{song.artist || 'Unknown'}</p>
          </motion.div>
        ))}
      </div>

      {/* Popular Artists */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-2xl">Popular Artists</h2>
        <Link href="#" className="text-[#B3B3B3] hover:text-white transition text-sm font-semibold">
          Show all
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {artists.slice(0, 5).map((artist, index) => (
          <Link href={`/artist/${encodeURIComponent(artist)}`} key={artist}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-[#1E1E1E] rounded-md p-4 hover:bg-[#282828] transition-all cursor-pointer text-center relative"
            >
              {/* Artist Image - Circular */}
              <div className="relative mb-4 overflow-hidden rounded-full mx-auto w-32 h-32">
                <img
                  src="/logo.png"
                  alt={artist}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {true && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-2 right-2 p-3 bg-[#1DB954] rounded-full hover:bg-[#1ed760] transition-all shadow-lg"
                  >
                    <Play size={20} className="text-black fill-black" />
                  </motion.button>
                )}
              </div>

              <p className="text-white font-semibold truncate">{artist}</p>
              <p className="text-[#B3B3B3] text-sm">
                {tracks.filter((t) => t.artist === artist).length} songs
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
        </>
      )}
    </main>
  );
}

export default GhostMain;
