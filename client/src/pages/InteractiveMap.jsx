import React, { useEffect , useState } from "react";
import MapView from "../components/MapView";
import axios from "../utils/axios";
import { getUser } from "../api/user";
import { useNavigate } from "react-router-dom";

const InteractiveMap = ({ active, setactive , activePersonalChat , setActivePersonalChat }) => {

  const [markers, setMarkers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setactive("interactive map");
    fetchMarkers();
    getCurrentUser();
  }, []);

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
    <div className="bg-gray-100 flex p-5 items-center">
      <div className="w-2/3">
        <MapView markers={markers} onMarkerClick={setSelectedUser} />
      </div>
      <div className="w-1/3">
        <div className="flex flex-col h-[27rem]">
          <div className="flex flex-col border border-gray-300 rounded-2xl p-5 h-3/4 ml-5">
            <h1 className="text-xl font-medium">Location Details</h1>
            <span className="text-gray-500">Select a marker on the map to see details</span>
            <div className="flex items-center justify-center h-4/5 flex-col text-gray-500">
              {selectedUser ? (
                <>
                  <span className="text-lg font-semibold text-black">{selectedUser.name}</span>
                  <span className="text-sm">{selectedUser.email}</span>
                  {selectedUser.passion && (
                    <span className="text-sm">Passion: {selectedUser.passion}</span>
                  )}
                  <button onClick={() => startChat(selectedUser.email)}>Chat</button>
                </>
              ) : (
                <>
                  <span>No location selected</span>
                  <span className="text-sm">Click on a marker to see details</span>
                </>
              )}
            </div>
          </div>
          <div className="h-1/4 ml-5 px-5 pt-5 font-medium">
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
  );
};

export default InteractiveMap;
