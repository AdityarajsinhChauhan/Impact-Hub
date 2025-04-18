import React, { useState, useRef, useEffect } from "react";

const SlidingNavbar = ({ sections, activeSection, onSelect }) => {
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const tabRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(
    sections.indexOf(activeSection) || 0
  );

  const handleClick = (index, section) => {
    setActiveIndex(index);
    onSelect(section);

    tabRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  useEffect(() => {
    const activeTab = tabRefs.current[activeIndex];
    const nav = navRef.current;
    const indicator = indicatorRef.current;

    if (activeTab && nav && indicator) {
      const tabRect = activeTab.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();

      indicator.style.width = `${tabRect.width}px`;
      indicator.style.left = `${activeTab.offsetLeft - nav.scrollLeft}px`;
    }
  }, [activeIndex, sections]);

  return (
    <div className="relative w-full py-1 bg-white rounded-md border border-gray-300 overflow-x-auto h-12 mt-5">
      <div className="w-full flex justify-center">
        <div
          ref={navRef}
          className="flex relative space-x-2 px-4 w-max"
        >
          {sections.map((section, index) => (
            <button
              key={index}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => handleClick(index, section)}
              className={`transition-all whitespace-nowrap text-sm font-medium relative z-10 px-4 py-2 rounded-md ${
                activeIndex === index
                  ? "text-white"
                  : "text-gray-600 hover:text-emerald-500"
              }`}
            >
              {section}
            </button>
          ))}
          <div
            ref={indicatorRef}
            className="absolute bg-emerald-500 h-8 rounded-md top-1 transition-all duration-300 z-0"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SlidingNavbar;
