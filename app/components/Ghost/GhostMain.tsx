'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Track = {
  id: string;
  title: string;
  artist?: string;
  src: string;
  album?: string;
  cover?: string;
};

type DeezerTrack = {
  id?: number;
  title?: string;
  preview?: string;
  artist?: {
    name?: string;
  };
  album?: {
    cover_medium?: string;
    cover_big?: string;
  };
};

function GhostMain() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/deezer?action=trending&limit=50');
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

        const deezerTracks: Track[] = (data.data || []).map(
          (track: DeezerTrack, idx: number) => ({
            id: track.id ? `deezer-${track.id}` : `dz-${idx}`,
            title: track.title || 'Unknown',
            artist: track.artist?.name || 'Unknown Artist',
            src: track.preview || '',
            cover:
              track.album?.cover_medium ||
              track.album?.cover_big ||
              '/logo.png',
          })
        );

        setTracks(deezerTracks);

        const uniqueArtists = Array.from(
          new Set(
            deezerTracks
              .map((t) => t.artist || 'Unknown')
              .filter((artist) => artist !== 'Unknown')
          )
        ) as string[];

        setArtists(uniqueArtists);
      } catch (error) {
        console.error('Error loading tracks:', error);
        setTracks([]);
        setArtists([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
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
            <Link
              href="#"
              className="text-[#B3B3B3] hover:text-white transition text-sm font-semibold"
            >
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
                  <Image
                    src={song.cover || '/logo.png'}
                    alt={song.title}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover rounded-md group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/logo.png';
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

                <p className="text-white font-semibold truncate mb-1">
                  {song.title}
                </p>
                <p className="text-[#B3B3B3] text-sm truncate">
                  {song.artist || 'Unknown'}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Popular Artists */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-2xl">Popular Artists</h2>
            <Link
              href="#"
              className="text-[#B3B3B3] hover:text-white transition text-sm font-semibold"
            >
              Show all
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-6">
            {artists.slice(0, 5).map((artist, index) => (
              <Link
                href={`/artist/${encodeURIComponent(artist)}`}
                key={artist}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-[#1E1E1E] rounded-md p-4 hover:bg-[#282828] transition-all cursor-pointer text-center relative"
                >
                  {/* Artist Circular Image */}
                  <div className="relative mb-4 overflow-hidden rounded-full mx-auto w-32 h-32">
                    <Image
                      src="/logo.png"
                      alt={artist}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute bottom-2 right-2 p-3 bg-[#1DB954] rounded-full hover:bg-[#1ed760] transition-all shadow-lg"
                    >
                      <Play size={20} className="text-black fill-black" />
                    </motion.button>
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
