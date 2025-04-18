import React, { useEffect, useState } from "react";
import SlidingNavbar from "../components/SlidingNavbar";
import categoryColors from "../assets/contentLibraryColors";
import { getContent, addContent } from "../api/content";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom"; // add this

const ContentLibrary = ({ active, setactive }) => {
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [imageError, setimageError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleItems, setVisibleItems] = useState(6);

  const navigate = useNavigate(); // for redirection

  useEffect(() => {
    setactive("content library");

    const fetchContent = async () => {
      try {
        const data = await getContent();
        setContent(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    const token = localStorage.getItem("token");

    if (token) {
      fetchContent();
    } else {
      navigate("/auth"); // redirect to login
    }
  }, []);

  // Reset visible items when category or search changes
  useEffect(() => {
    setVisibleItems(6);
  }, [selectedCategory, searchQuery]);
  
  // Filter by category and search query
  const filteredContent = content
    .filter(item => selectedCategory === "All" || item.category === selectedCategory)
    .filter(item => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleShowMore = () => {
    setVisibleItems(prevVisible => prevVisible + 6);
  };

  // Limit the displayed items
  const displayedContent = filteredContent.slice(0, visibleItems);
  const hasMoreItems = visibleItems < filteredContent.length;

  return (
    <div className="relative bg-gray-100 min-h-screen pb-16">
      
      {isLoading ? (<Loader text="Loading content..."/>) : (<>
        <div className="flex">
        
        <div className="flex flex-col mt-5 w-full px-5 md:px-10">
        <h1 className="text-3xl text-emerald-500 font-bold ">Content Library</h1>
        <span className="text-black font-medium">Welcome to the Content Library, your go-to hub for insightful articles, guides, and resources.</span>
        <input 
          type="text" 
          placeholder="Search" 
          value={searchQuery}
          onChange={handleSearchChange}
          className="md:w-1/2 w-full mt-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
        />
          <SlidingNavbar
          sections={[
            "All",
            "article",
            "ted",
            "video",
            "book"
          ]}
          activeSection={selectedCategory}
          onSelect={setSelectedCategory}
        /></div>
      </div>
     
      
      <div className="grid mx-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {displayedContent.length > 0 ? (
          displayedContent.map((item, index) => (
            <div
              key={index}
              className={`hover:shadow-lg rounded-md overflow-hidden relative bg-white `}
            >
              <a href={item.link} target="_blank" rel="noopener noreferrer">
              <div className="w-full h-40 flex items-center justify-center relative">
                <img
                  src={item.image}
                  alt={item.category}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    setimageError(true)
                    e.target.style.display = "none";
                  }}
                />
                {imageError && (
                  <span className="absolute text-gray-500 bg-gray-200 text-sm font-semibold h-full w-full flex items-center justify-center">
                    image not found
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className={`text-xs text-white rounded-full absolute top-2 left-2 uppercase px-2 py-1 ${
        categoryColors[item.category] || "bg-gray-500"
      }`}>
                  {item.category}
                </span>
                <h2 className="text-xl font-semibold mt-2">{item.title}</h2>
                
                  
                
                <p className="text-gray-500 text-sm mt-2 line-clamp-3">{item.description}</p>
                
              </div>
              </a>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No content found matching your search.
          </p>
        )}
      </div>

      {/* Show More button */}
      {hasMoreItems && (
        <div className="flex justify-center mt-10">
          <button 
            onClick={handleShowMore} 
            className="bg-emerald-500 hover:bg-black text-white px-8 py-2 rounded-full transition-all duration-300"
          >
            Show More
          </button>
        </div>
      )}

      {/* Display count */}
      <div className="text-center text-gray-500 mt-4">
        Showing {Math.min(visibleItems, filteredContent.length)} of {filteredContent.length} items
      </div>
      </>)} 
      
    </div>
  );
};

export default ContentLibrary;
