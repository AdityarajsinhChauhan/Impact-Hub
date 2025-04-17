import React , {useState, useRef, useEffect} from 'react'

const SlidingNavbar = ({ sections, activeSection, onSelect }) => {
    const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(
    sections.indexOf(activeSection) || 0
  );

  const handleClick = (index, section) => {
    setSelectedIndex(index);
    onSelect(section); // Update parent state
  };

  useEffect(() => {
    if (navRef.current && indicatorRef.current) {
      const activeTab = navRef.current.children[activeIndex];
      indicatorRef.current.style.width = `${activeTab.offsetWidth}px`;
      indicatorRef.current.style.left = `${activeTab.offsetLeft}px`;
    }
  }, [activeIndex, sections]);
  return (
    <div className="relative w-full border border-gray-500 pr-4 py-2 bg-white rounded-md  overflow-hidden h-12 mt-5">
        <div ref={navRef} className="flex justify-center relative space-x-1">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => {
                setActiveIndex(index);
                handleClick(index, section)}}
            className={`relative transition-all duration-300  z-10 px-6 py-1 text font-medium ${activeIndex === index ? 'text-white hover:text-white' : 'text-gray-500 hover:text-emerald-500'}`}
          >
            {section}
          </button>
        ))}
        <div
          ref={indicatorRef}
          className="absolute bottom-0 top-0 bg-emerald-500 rounded-md transition-all duration-300"
        ></div>
      </div>
      
    </div>
  )
}

export default SlidingNavbar
