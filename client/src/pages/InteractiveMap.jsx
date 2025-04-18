import React, { useEffect , useState } from "react";
import MapView from "../components/MapView";
import axios from "../utils/axios";
import { getUser } from "../api/user";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const InteractiveMap = ({ active, setactive , activePersonalChat , setActivePersonalChat }) => {

  const [markers, setMarkers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setactive("interactive map");
    fetchMarkers();
    getCurrentUser();
  }, []);

  // Reset showUserDetails when selectedUser changes
  useEffect(() => {
    if (!selectedUser) {
      setShowUserDetails(false);
    }
  }, [selectedUser]);

  const getCurrentUser = async () => {
    const res = await getUser();
    setCurrentUserEmail(res.email);
  };

  const fetchMarkers = async () => {
    try {
      const res = await axios.get("/location");
      setMarkers(res.data);
    } catch (err) {
      console.error("Error fetching markers", err);
    }finally {
      setIsLoading(false); 
    }
  };

  const handleAddLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await axios.post("/location", {
            latitude,
            longitude
          });
          fetchMarkers(); // Refresh markers
        } catch (err) {
          console.error("Error saving location", err);
        }
      });
    } else {
      alert("Geolocation not supported!");
    }
  };

  // Updated function to handle marker clicks
  const handleMarkerClick = (user) => {
    setSelectedUser(user);
    // Don't show details immediately, wait for "View Details" button click
    setShowUserDetails(false);
  };

  // Function to handle "View Details" button click from the popup
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const startChat = async (otherUserEmail) => {
    if(currentUserEmail === otherUserEmail){
      alert("You cannot chat with yourself");
      return;
    }
    const res = await axios.post('/personalChat', {
      email1: currentUserEmail,
      email2: otherUserEmail,
    });
    const chatId = res.data._id;
    setActivePersonalChat(chatId);
    navigate("/personal-chat");
  };

  return (
    <>
    {isLoading ? (<Loader text="Loading markers..."/>) : (
    <div className="bg-gray-100 flex md:flex-row flex-col p-5 items-center">
      <div className="md:w-2/3 w-full z-10">
        <MapView 
          markers={markers} 
          onMarkerClick={handleMarkerClick}
          onViewDetails={handleViewDetails} 
        />
      </div>
      <div className="md:w-1/3 w-full">
        <div className="flex flex-col h-[27rem]">
          <div className="flex flex-col border border-gray-300 rounded-2xl p-5 h-3/4 md:mt-0 mt-5 md:ml-5 bg-white shadow-md">
            <h1 className="text-xl font-medium">Location Details</h1>
            {!showUserDetails && (
              <span className="text-gray-500">Select a marker on the map to see details</span>
            )}
            <div className="flex items-center justify-center h-4/5 flex-col text-gray-500">
              {selectedUser && showUserDetails ? (
                <div className="w-full flex flex-col items-center space-y-3">
                  <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center text-gray-200 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                  
                  <div className="w-full flex flex-col space-y-2 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-gray-700">{selectedUser.email}</span>
                    </div>
                    
                    {selectedUser.passion && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Passion: {selectedUser.passion}</span>
                      </div>
                    )}
                    
                    {selectedUser.bio && (
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-1 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{selectedUser.bio}</span>
                      </div>
                    )}
                    
                    {selectedUser.interests && selectedUser.interests.length > 0 && (
                      <div className="flex flex-col">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                          </svg>
                          <span className="text-gray-700">Interests:</span>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-7">
                          {selectedUser.interests.map((interest, index) => (
                            <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => startChat(selectedUser.email)}
                    className="mt-3 px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-black transition-all duration-300"
                  >
                    Start Chat
                  </button>
                </div>
              ) : (
                <>
                  <span>No location selected</span>
                  <span className="text-sm">Click on a marker to see details</span>
                </>
              )}
            </div>
          </div>
          <div className="h-1/4 md:ml-5 ml-0 md:px-5 px-2 pt-5 font-medium w-full">
            <button
              onClick={handleAddLocation}
              className="bg-emerald-500 text-white p-2 w-[47%] hover:bg-black transition-all duration-300"
            >
              Add My Location
            </button>
            <button className="border border-black p-2 w-[47%] ml-5 hover:bg-black hover:text-white transition-all duration-300">
              Map Legend
            </button>
          </div>
        </div>
      </div>
    </div>
    )}
    </>
  );
};

export default InteractiveMap;
