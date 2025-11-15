'use client';

import { Earth, Plus } from 'lucide-react';
import React from 'react';

export default function GhostSidebar() {
  return (
    <aside className="absolute top-16 left-2 w-[350px] h-[680px] rounded-md bg-[#121212] overflow-y-auto flex flex-col gap-6">
      {/* Header */}
      <div className='flex items-center justify-between p-4'>
        <p className='text-white font-bold text-lg'>Your Library</p>
        <button className='text-[#B3B3B3] p-2 rounded-full hover:bg-gray-800 transition'>
          <Plus size={20} />
        </button>
      </div>

      {/* Empty State */}
     <div className='flex flex-col gap-2 bg-[#1E1E1E] p-4 rounded-md w-[330px] mx-auto'>
  <p className='text-white font-bold text-md'>Create your first playlist</p>
  <p className='text-white text-sm'>It's easy, we'll help you</p>
  <button className='bg-white text-black w-[140px] h-[44px] rounded-full text-md font-bold hover:scale-105 transition-transform mt-2'>
    Create Playlist
  </button>
</div>

<div className='flex flex-col gap-2 bg-[#1E1E1E] p-4 rounded-md w-[330px] mx-auto'>
  <p className='text-white font-bold text-md'>Let's find some podcasts to follow</p>
  <p className='text-white text-sm'>We'll keep you updated on new episodes</p>
  <button className='bg-white text-black w-[140px] h-[44px] rounded-full text-md font-bold hover:scale-105 transition-transform mt-2'>
    Browse Podcasts
  </button>
</div>



      <footer className='mt-auto px-6 flex flex-wrap gap-2 text-[10px] max-w-[350px] text-[#B3B3B3]'>
        <p className='cursor-pointer hover:underline'>Legal</p>
        <p className='cursor-pointer hover:underline'>Safety & Privacy Center</p>
        <p className='cursor-pointer hover:underline'>Privacy Policy</p>
        <p className='cursor-pointer hover:underline'>Cookies</p>
        <p className='cursor-pointer hover:underline mt-2'>About Ads</p>
        <p className='cursor-pointer hover:underline mt-2'>Accessibility</p>
     </footer>
<p className='cursor-pointer hover:underline text-white px-6 text-[10px]'>Cookies</p>
    {/* cookies text and language */}
<div className='text-[10px] text-[#B3B3B3] px-6 mb-10'>
  
  <button className='flex items-center w-[100px] bg-transparent text-white border border-white font-bold rounded-full py-1 px-2 text-sm cursor-pointer hover:underline'>
    <span><Earth size={20} className='me-2'/></span>
    English
  </button>
</div>


    </aside>
  );
}
