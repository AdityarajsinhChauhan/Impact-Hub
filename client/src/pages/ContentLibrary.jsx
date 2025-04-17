import React, { useEffect, useState } from "react";
import SlidingNavbar from "../components/SlidingNavbar";
import categoryColors from "../assets/contentLibraryColors";
import { getContent, addContent } from "../api/content";

const ContentLibrary = ({ active, setactive }) => {
  const [content, setContent] = useState([]);
  useEffect(() => {
    setactive("content library");
    const fetchContent = async () => {
      try{
        const data = await getContent();
        setContent(data);
      } catch (err) {
        console.log(err);
      }
    };
    const token = localStorage.getItem("token");
    if(token){
      fetchContent();
    }
  }, []);
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredContent =
    selectedCategory === "All"
      ? content
      : content.filter((item) => item.category === selectedCategory);

  const [imageError, setimageError] = useState(false)
  return (
    <div className=" relative bg-gray-100">
      
      <div className="flex">
        
        <div className="flex flex-col mt-5 w-full px-10">
        <h1 className="text-3xl text-emerald-500 font-bold ">Content Library</h1>
        <span className="text-black font-medium">Welcome to the Content Library, your go-to hub for insightful articles, guides, and resources.</span>
        <input type="text" placeholder="Search" className="w-1/2 mt-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
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
        {filteredContent.length > 0 ? (
          filteredContent.map((item, index) => (
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
            No content available in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentLibrary;
