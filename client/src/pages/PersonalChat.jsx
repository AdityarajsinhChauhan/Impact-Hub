import React, { useEffect, useState } from "react";
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
  

  const sendMessage = () => {
    if (!newMessage.trim() || !activePersonalChat) return;
  
    socket.emit("sendPersonalMessage", {
      chatId: activePersonalChat,
      sender: user.email,
      content: newMessage,
    });
  
    setNewMessage("");
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

  return (
    <div className="h-[89vh]  w-screen flex">
      <div className="h-full w-1/4 border-r border-gray-200 flex flex-col px-5">
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

      <div className="h-full w-3/4 flex flex-col">
  {activePersonalChat ? (
    <>
      {/* Header */}
      <header className="flex justify-between border-b border-gray-200 p-5 h-[15%]">
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
          <img
            src="/ui-images/hamburger.svg"
            alt="menu"
            className="w-5 h-5"
          />
        </div>
      </header>

      {/* Messages */}
      <div className="flex flex-col border-b border-gray-300 h-[70%]">
        <div className="flex flex-col overflow-y-scroll px-5">
          {user &&
            messages.map((msg, idx) => (
              <div key={idx}>
                {msg.sender === user.email ? (
                  <div className="flex justify-end mt-3 mr-5">
                    <div className="max-w-96 bg-emerald-500 text-white p-3 rounded-lg">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex mt-3 border border-gray-300 w-fit max-w-[50%] rounded-md">
                    <div className="flex flex-col">
                      <div className="w-3/5 p-3">{msg.content}</div>
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
