import React from 'react'

const trendsongs = [
    {
        id: 1,
        title: 'title',
        artist: 'artist',
        src: '/musics/love_is.mp3',
        album: 'album',
        cover: '/logo.png',
    },
    {
        id: 2,
        title: 'title',
        artist: 'artist',
        src: '/musics/love_is.mp3',
        album: 'album',
        cover: '/logo.png',
    },
    {
        id: 3,
        title: 'title',
        artist: 'artist',
        src: '/musics/love_is.mp3',
        album: 'album',
        cover: '/logo.png',
    },
    {
        id: 4,
        title: 'title',
        artist: 'artist',
        src: '/musics/love_is.mp3',
        album: 'album',
        cover: '/logo.png',
    },
    {
        id: 5,
        title: 'title',
        artist: 'artist',
        src: '/musics/love_is.mp3',
        album: 'album',
        cover: '/logo.png',
    },
]
function GhostMain() {
  return (
    <div className='absolute top-16 left-[365px] w-[1110px] h-[680px] rounded-md bg-gradient-to-bl from-[#222222] to-[#121212] overflow-y-auto flex flex-col'>
        {/* trending songs */}
      <div className='flex items-center justify-between p-6 px-8'>
        <p className='text-white font-bold text-2xl'>Trending songs</p>
        <button className='text-[#B3B3B3] p-2 text-sm rounded-full hover:bg-gray-800 transition'>
          <p>SHow all</p>
        </button>
      </div>

        <div className='grid grid-cols-5 gap-6 px-8'>
            {trendsongs.map((song) => (
                <div key={song.id} className='bg-[#1E1E1E] rounded-md p-4 flex flex-col items-start hover:scale-105 transition-transform cursor-pointer'>
                    <img src={song.cover} alt={song.title} className='w-32 h-32 rounded-md mb-4 object-cover mx-auto' />
                    <p className='text-white font-bold text-lg mb-2'>{song.title}</p>
                    <p className='text-[#B3B3B3] text-sm'>{song.artist}</p>
                </div>
            ))}
        </div>

        {/* popular artists */}
            <div className='flex items-center justify-between p-6 px-8'>
        <p className='text-white font-bold text-2xl'>Trending songs</p>
        <button className='text-[#B3B3B3] p-2 text-sm rounded-full hover:bg-gray-800 transition'>
          <p>SHow all</p>
        </button>
      </div>

        <div className='grid grid-cols-5 gap-6 px-8'>
            {trendsongs.map((song) => (
                <div key={song.id} className='bg-none rounded-full p-4 flex flex-col items-start hover:scale-105 transition-transform cursor-pointer'>
                    <img src={song.cover} alt={song.title} className='w-38 h-38 rounded-md mb-4 object-cover mx-auto' />
                    <p className='text-white font-bold text-lg mb-2'>{song.title}</p>
                    <p className='text-[#B3B3B3] text-sm'>{song.artist}</p>
                </div>
            ))}
        </div>

    </div>
  )
}

export default GhostMain
