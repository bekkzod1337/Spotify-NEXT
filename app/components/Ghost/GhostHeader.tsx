import { Archive, Download, Home, Search } from 'lucide-react';
import React from 'react';
import { GoBrowser } from 'react-icons/go';

function GhostHeader() {
  return (
    <div className='p-4 h-16 flex items-center justify-between bg-black max-w-[1540px] mx-auto'>
      {/* Left section */}
      <div className="bg-black/50 rounded-full flex gap-4 items-center p-2 cursor-pointer hover:bg-black/70">
        <a href="/" className='w-10 h-10'>
          <img src="/logo.png" alt="Logo" className='w-full h-full object-contain' />
        </a>
        <a href="/" className='flex items-center justify-center'>
          <Home size={40} className="text-white p-2 rounded-full bg-[#2A2A2A] hover:bg-gray-500 transition-colors" />
        </a>
        <div className='flex items-center bg-[#2A2A2A] border border-[#353535] rounded-full px-2 py-1 w-[400px] h-12 justify-between'>
          <Search size={30} className="text-[#B3B3B3] cursor-pointer" />
          <input 
            type="search" 
            placeholder='What do you want to play?' 
            className='bg-transparent text-white outline-none ' 
          />
          <div className='w-[1px] h-[30px] bg-gray-500 ml-20'></div>
          <Archive size={30} className="text-[#B3B3B3] cursor-pointer mr-2" />
        </div>
      </div>

      {/* Right section */}
      <div className='flex items-center gap-6'>
        <a href="/premium" className='font-bold text-[#B3B3B3] hover:text-white transition-colors'>Premium</a>
        <a href="/support" className='font-bold text-[#B3B3B3] hover:text-white transition-colors'>Support</a>
        <a href="/download" className='font-bold text-[#B3B3B3] hover:text-white transition-colors'>Download</a>

        <div className='w-[1px] h-[30px] bg-gray-500'></div>

        <div className='flex items-center gap-4 pl-6'>
          <a href="/download" className='flex items-center gap-2'>
            <Download size={24} className="text-white" />
            <span className='font-bold text-[#B3B3B3]'>Install App</span>
          </a>
          <button className='font-bold text-[#B3B3B3] hover:text-white transition-colors'>Sign up</button>
          <button className='bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform'>Log in</button>
        </div>
      </div>
    </div>
  );
}

export default GhostHeader;
