import React , { useState } from 'react'
import { Link } from 'react-router-dom'

const NavMenu = ({ showMenu , setshowMenu }) => {
    const [active, setactive] = useState("home");
  return (
    <div className={`fixed transition-all duration-300 shadow-lg top-0 left-0 z-50  bg-white w-[60vw]
    ${showMenu ? "translate-x-0" : "-translate-x-full"}
    `}>
        <ul className='relative pt-12 pb-10'>
            <img onClick={()=>{setshowMenu(false)}} src="/ui-images/close.svg" className='absolute top-3 right-3 w-5 h-5' alt="" />
        <li className={`text-lg font-medium pl-5 py-3  
        ${active === "home" ? "bg-black text-white" : "hover:bg-gray-200"}`}
        onClick={() => {
            setactive("home");
          }}
        >
            <Link to="/">home</Link>
        </li>
        <li className={`text-lg font-medium pl-5 py-3  
        ${active === "content library" ? "bg-black text-white" : "hover:bg-gray-200"}`}
        onClick={() => {
            setactive("content library");
          }}
        >
            <Link to="/content-library">content library</Link>
        </li>
        <li className={`text-lg font-medium pl-5 py-3  
        ${active === "find your passion" ? "bg-black text-white" : "hover:bg-gray-200"}`}
        onClick={() => {
            setactive("find your passion");
          }}
        >
            <Link to="/find-passion">find your passion</Link>
        </li>
        <li className={`text-lg font-medium pl-5 py-3  
        ${active === "action hub" ? "bg-black text-white" : "hover:bg-gray-200"}`}
        onClick={() => {
            setactive("action hub");
          }}
        >
            <Link to="/action-hub">action hub</Link>
        </li>
        <li className={`text-lg font-medium pl-5 py-3  
        ${active === "interactive map" ? "bg-black text-white" : "hover:bg-gray-200"}`}
        onClick={() => {
            setactive("interactive map");
          }}
        >
            <Link to="/interactive-map">interactive map</Link>
        </li>
        <li className={`text-lg font-medium pl-5 py-3  
        ${active === "chat" ? "bg-black text-white" : "hover:bg-gray-200"}`}
        onClick={() => {
            setactive("chat");
          }}
        >
            <Link to="/community-chat">community & chat</Link>
        </li>
        </ul>
    
      
    </div>
  )
}

export default NavMenu
