import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Navigate, useParams, Link } from "react-router-dom";
import io from "socket.io-client";
import { getDiscussionById } from "../api/community";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const Chat = ({ active, setactive , user, setUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { discussionId } = useParams(); // Use null to track loading state
  const [loadingMessages, setLoadingMessages] = useState(true); // Track message loading state
  const [currentDiscussion, setCurrentDiscussion] = useState(null);


  useEffect(() => {
    setactive("community & chat");

    const fetchDiscussion = async () => {
      const discussion = await getDiscussionById(discussionId);
      setCurrentDiscussion(discussion);
    };
    fetchDiscussion();


  }, []);

  useEffect(() => {
    if (user) {
      socket.emit("joinDiscussion", discussionId);

      axios.get(`/messages/${discussionId}`).then((res) => {
        setMessages(res.data);
        setLoadingMessages(false); // Set loading state to false once messages are fetched
      });

      socket.on("receiveMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [discussionId, user]); // Depend on both discussionId and user

  const handleSend = () => {
    if (text.trim()) {
      socket.emit("sendMessage", { discussionId, user: user?.name, text });
      setText("");
    }
  };

  if (user === null || loadingMessages) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p> {/* You can add a spinner here instead */}
      </div>
    );
  }

  return (
    <div className=" h-[79vh]">
      <header className="flex flex-col bg-white border-b border-gray-300 mb-3 pb-5 justify-between">
      <Link to="/community-chat" className="ml-32 text-sm hover:underline hover:text-emerald-500 text-gray-500">
            back to community & chat
          </Link>
        <div className="mt-1">
          
          <h1 className="ml-32 text-2xl font-medium">{currentDiscussion?.title}</h1>

          <div className="ml-32 text-gray-500 text-sm">
            <span className="font-medium text-gray-700 mt-5">description:</span> {currentDiscussion?.description}
          </div>
        </div>
      </header>
      <div className="flex flex-col border-b border-gray-300 h-[78%]">
        <div className="flex flex-col overflow-y-scroll px-10">
          {messages.map((msg, idx) => (
            <div key={idx}>
              {msg.user === user?.name ? (
                <div className="flex justify-end mt-3 mr-5">
                  <div className="max-w-96 bg-emerald-500 rounded-lg text-white p-3">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div className="flex mt-3">
                  <div className="min-w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">{msg.user}</span>
                    <div className="w-3/5 bg-white border border-gray-300 rounded-lg p-3">{msg.text}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full h-[12%] px-10">
        <input
          type="text"
          className="w-10/12 mr-5 my-3 bg-white border border-gray-300"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="bg-emerald-500 rounded-full px-2 h-10 w-10 my-2 hover:bg-black duration-300 transition-all"
          onClick={handleSend}
        >
          <img
            src="/ui-images/send.png"
            alt="send"
            className="w-5 h-5 invert"
          />
        </button>
      </div>
    </div>
  );
};

export default Chat;
