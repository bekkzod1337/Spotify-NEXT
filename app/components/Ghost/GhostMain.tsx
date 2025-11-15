'use client';

import React, { useEffect, useState } from 'react';
import { getTopTracks } from '../../api/api'; // api.ts faylini import qildik

type Track = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
  preview_url: string | null;
};

export default function GhostMain() {
  const [trendingSongs, setTrendingSongs] = useState<Track[]>([]);

  useEffect(() => {
    async function fetchTracks() {
      try {
        const tracks = await getTopTracks();
        setTrendingSongs(tracks);
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
      }
    }
    fetchTracks();
  }, []);

  return (
    <div className='absolute top-16 left-[365px] w-[1110px] h-[680px] rounded-md bg-gradient-to-bl from-[#222222] to-[#121212] overflow-y-auto flex flex-col'>
      
      {/* trending songs */}
      <div className='flex items-center justify-between p-6 px-8'>
        <p className='text-white font-bold text-2xl'>Trending songs</p>
        <button className='text-[#B3B3B3] p-2 text-sm rounded-full hover:bg-gray-800 transition'>
          <p>Show all</p>
        </button>
      </div>

      <div className='grid grid-cols-5 gap-6 px-8'>
        {trendingSongs.map((song) => (
          <div
            key={song.id}
            className='bg-[#1E1E1E] rounded-md p-4 flex flex-col items-start hover:scale-105 transition-transform cursor-pointer'
          >
            <img
              src={song.album.images[0]?.url || '/logo.png'}
              alt={song.name}
              className='w-32 h-32 rounded-md mb-4 object-cover mx-auto'
            />
            <p className='text-white font-bold text-lg mb-2'>{song.name}</p>
            <p className='text-[#B3B3B3] text-sm'>
              {song.artists.map((a) => a.name).join(', ')}
            </p>
          </div>
        ))}
      </div>

      {/* popular artists (shu API dan faqat artistlar ro'yxati) */}
      <div className='flex items-center justify-between p-6 px-8 mt-8'>
        <p className='text-white font-bold text-2xl'>Popular artists</p>
        <button className='text-[#B3B3B3] p-2 text-sm rounded-full hover:bg-gray-800 transition'>
          <p>Show all</p>
        </button>
      </div>

      <div className='grid grid-cols-5 gap-6 px-8'>
        {trendingSongs.map((song, idx) => (
          <div
            key={idx}
            className='bg-none rounded-full p-4 flex flex-col items-start hover:scale-105 transition-transform cursor-pointer'
          >
            <img
              src={song.album.images[0]?.url || '/logo.png'}
              alt={song.artists.map((a) => a.name).join(', ')}
              className='w-38 h-38 rounded-full mb-4 object-cover mx-auto'
            />
            <p className='text-white font-bold text-lg mb-2'>
              {song.artists.map((a) => a.name).join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
