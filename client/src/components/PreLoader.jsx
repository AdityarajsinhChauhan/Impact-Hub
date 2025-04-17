import React from 'react'

const PreLoader = () => {
  return (
    <div>
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      {/* Spinning emerald circle */}
      <div className="w-24 h-24 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>

      {/* Pulse Text */}
      <div className=" text-xl md:text-2xl font-semibold animate-pulse tracking-wide">
        Impact Hub is loading...
      </div>
    </div>
      
    </div>
  )
}

export default PreLoader
