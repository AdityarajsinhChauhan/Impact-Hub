import React from 'react'

const Loader = ({text}) => {
  return (
    <div>
       <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      {/* Spinning emerald circle */}
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>

      {/* Pulse Text */}
      <div className=" text-xl md:text-2xl font-semibold animate-pulse tracking-wide">
        {text}
      </div>
    </div>
      
    </div>
  )
}

export default Loader
