import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import io from "socket.io-client";
import { getUser } from "../api/user";
import { Link } from "react-router-dom";
import socket from "../utils/socket";
import { getUserByEmail } from "../api/user";

const ChatPage = ({
  active,
  setactive,
  user,
  setUser,
  activePersonalChat,
  setActivePersonalChat,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [nameMap, setNameMap] = useState({});
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);
  const [isLoadingPartner, setIsLoadingPartner] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!activePersonalChat) return;
  
    socket.emit("joinPersonalChat", activePersonalChat);
  
    axios.get(`/personalChat/chat/${activePersonalChat}`).then((res) => {
      setMessages(res.data.messages);
    });
  
    socket.on("receivePersonalMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
  
    return () => {
      socket.off("receivePersonalMessage");
    };
  }, [activePersonalChat]);
  
  // Handle outside click to close user details popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserDetails(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim() || !activePersonalChat) return;
  
    socket.emit("sendPersonalMessage", {
      chatId: activePersonalChat,
      sender: user.email,
      content: newMessage,
    });
  
    setNewMessage("");
  };
  
  // Load chat partner details
  const loadChatPartnerDetails = async () => {
    if (!activePersonalChat || !user) return;

    const currentChat = conversations.find((c) => c._id === activePersonalChat);
    if (!currentChat) return;

    const partnerEmail = currentChat.participants.find((p) => p !== user.email);
    if (!partnerEmail) return;

    setIsLoadingPartner(true);
    try {
      const partnerData = await getUserByEmail(partnerEmail);
      setChatPartner(partnerData);
    } catch (err) {
      console.error("Error fetching partner details:", err);
    } finally {
      setIsLoadingPartner(false);
    }
  };

  // Toggle user details popup
  const toggleUserDetails = () => {
    if (!showUserDetails && !chatPartner) {
      loadChatPartnerDetails();
    }
    setShowUserDetails(!showUserDetails);
  };

  useEffect(() => {
    const getPersonalChats = async () => {
      if (user?.email) {
        const res = await axios.get(`/personalChat/${user.email}`);
        setConversations(res.data);

        const nameMapTemp = {};

        for (const chat of res.data) {
          const otherEmail = chat.participants.find((p) => p !== user.email);
          if (otherEmail && !nameMapTemp[otherEmail]) {
            try {
              const userData = await getUserByEmail(otherEmail);
              nameMapTemp[otherEmail] = userData.name || otherEmail;
            } catch (err) {
              console.error("Error fetching user name:", err);
              nameMapTemp[otherEmail] = otherEmail; // fallback to email
            }
          }
        }

        setNameMap(nameMapTemp);
      }
    };

    getPersonalChats();
  }, [user]);

  // Reset user details when changing chats
  useEffect(() => {
    setShowUserDetails(false);
    setChatPartner(null);
  }, [activePersonalChat]);

  return (
    <div className="h-[89vh]  w-screen flex md:flex-row flex-col">
      <div className="md:h-full h-[40%] overflow-y-scroll md:w-1/4 w-full border-r border-gray-200 flex flex-col px-5">
        <h1 className="text-xl font-bold">Messages</h1>
        <input
          type="text"
          placeholder="Search"
          className="w-full py-1 px-3 border mt-5 rounded-md border-gray-200"
        />
        <div className="bg-gray-200 w-full h-[1px] mt-5"></div>

        {/* chat list */}
        {conversations.map((chat) => {
          const other = chat.participants.find((p) => p !== user.email);
          return (
            <div
              onClick={() => {
                setActivePersonalChat(chat._id);
              }}
              key={chat._id}
              className={`flex gap-5 p-3 transition-all duration-300 cursor-pointer rounded-lg ${
                activePersonalChat === chat._id
                  ? "bg-emerald-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 my-auto"></div>
              <div className="flex flex-col">
                <span>{nameMap[other] || other}</span>
                <span className="text-gray-500 text-sm">Last message</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="md:h-full h-[60%] md:w-3/4 w-full flex flex-col">
        {activePersonalChat ? (
          <>
            {/* Header */}
            <header className="flex justify-between border-b border-gray-200 p-5 h-[15%] relative">
              <div className="flex gap-5">
                <div className="w-8 h-8 rounded-full bg-gray-200 my-auto"></div>
                <div>
                  {
                    nameMap[
                      conversations.find((c) => c._id === activePersonalChat)
                        ?.participants.find((p) => p !== user.email)
                    ] || "Loading..."
                  }
                </div>
              </div>
              <div>
                <button 
                  onClick={toggleUserDetails}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <img
                    src="/ui-images/hamburger.svg"
                    alt="menu"
                    className="w-5 h-5"
                  />
                </button>
              </div>

              {/* User Details Popup */}
              {showUserDetails && (
                <div 
                  ref={menuRef}
                  className="absolute top-16 right-4 w-72 bg-white border border-gray-200 shadow-lg rounded-lg z-10"
                >
                  {isLoadingPartner ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin h-5 w-5 border-2 border-emerald-500 rounded-full border-t-transparent mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading user details...</p>
                    </div>
                  ) : chatPartner ? (
                    <div className="p-4">
                      <div className="flex flex-col items-center pb-3 border-b border-gray-200">
                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-gray-200 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-lg">{chatPartner.name}</h3>
                        <p className="text-gray-600 text-sm">{chatPartner.email}</p>
                      </div>

                      <div className="mt-3 space-y-2">
                        {chatPartner.passion && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">Passion: {chatPartner.passion}</span>
                          </div>
                        )}

                        {chatPartner.bio && (
                          <div>
                            <div className="flex items-center mb-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">About</span>
                            </div>
                            <p className="text-gray-700 text-sm pl-7">{chatPartner.bio}</p>
                          </div>
                        )}

                        {chatPartner.interests && chatPartner.interests.length > 0 && (
                          <div>
                            <div className="flex items-center mb-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                              </svg>
                              <span className="font-medium">Interests</span>
                            </div>
                            <div className="flex flex-wrap gap-1 pl-7">
                              {chatPartner.interests.map((interest, index) => (
                                <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-600">
                      No user details available
                    </div>
                  )}
                </div>
              )}
            </header>

            {/* Messages */}
            <div className="flex flex-col border-b border-gray-300 h-[70%]">
              <div className="flex flex-col overflow-y-scroll px-5">
                {user &&
                  messages.map((msg, idx) => (
                    <div key={idx}>
                      {msg.sender === user.email ? (
                        <div className="flex justify-end mt-3 mr-5">
                          <div className="max-w-96 bg-emerald-500 text-white p-3 rounded-xl rounded-tr-none">
                            {msg.content}
                          </div>
                        </div>
                      ) : (
                        <div className="flex mt-3 border bg-white border-gray-300 w-fit max-w-[50%] rounded-xl rounded-tl-none">
                          <div className="flex flex-col">
                            <div className="w-3/5 p-3 ">{msg.content}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex w-full h-[12%] px-5">
              <input
                type="text"
                className="w-11/12 mr-5 my-3 bg-white border border-gray-300"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                className="bg-emerald-500 hover:bg-black duration-300 transition-all text-white my-3 w-10 h-10 flex items-center justify-center rounded-full"
                onClick={sendMessage}
              >
                <img
                  src="/ui-images/send.png"
                  alt="send"
                  className="w-5 h-5 mr-1 invert"
                />
              </button>
            </div>
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-500 text-lg">
            Select a chat to see messages
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
