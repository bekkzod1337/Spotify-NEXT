import React from 'react'

function GhostFooter() {
  return (
    <div className='absolute bg-gradient-to-r from-[#AE2997] to-[#509AF5] w-[1465px] top-188 left-2 h-[65px] overflow-y-auto flex flex-col gap-6 justify-between items-center px-6 py-4 md:flex-row md:py-0'>
      <div>
      <p className='text-white'>Prewiew of Spotify</p>
      <p className='text-white'>Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed.</p>
      </div>
      <div>
        <button className='rounded-full text-black bg-white w-[140px] h-[44px] font-bold'>Sign up free</button>
      </div>
    </div>
  )
}

export default GhostFooter
