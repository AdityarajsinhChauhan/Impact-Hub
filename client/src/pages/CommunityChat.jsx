import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { getDiscussions, createDiscussion } from "../api/community";
import { getUser, getUserByEmail } from "../api/user";
import AddDiscussionForm from "../components/AddDiscussionForm";
import Loader from "../components/Loader";

const CommunityChat = ({
  active,
  setactive,
  setActivePersonalChat,
  activePersonalChat,
  user,
  setUser,
}) => {
  const [msg, setMsg] = useState("");
  const [chatType, setchatType] = useState("discussion");
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [allDiscussions, setAllDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [conversations, setConversations] = useState([]);
  const [userNameMap, setUserNameMap] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    setactive("community & chat");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setactive("community & chat");

      const nameMap = {};

      try {
        // Fetch all discussions
        const discussionsResponse = await getDiscussions();
        setAllDiscussions(discussionsResponse);

        // Fetch personal chats
        if (user?.email) {
          const res = await axios.get(`/personalChat/${user.email}`);
          setConversations(res.data);

          await Promise.all(
            res.data.map(async (chat) => {
              const otherEmail = chat.participants.find(
                (p) => p !== user.email
              );
              if (otherEmail && !nameMap[otherEmail]) {
                try {
                  const userData = await getUserByEmail(otherEmail);
                  nameMap[otherEmail] = userData.name || otherEmail;
                } catch (err) {
                  console.error(
                    "Error fetching user for email:",
                    otherEmail,
                    err
                  );
                  nameMap[otherEmail] = otherEmail;
                }
              }
            })
          );
          setUserNameMap({ ...nameMap });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, showDiscussionForm]);

  return (
    <div>
      {showDiscussionForm && (
        <AddDiscussionForm
          showDiscussionForm={showDiscussionForm}
          setShowDiscussionForm={setShowDiscussionForm}
        />
      )}

      {isLoading ? (
        <Loader text="Loading community chat..." />
      ) : (
        <>
          <header className="relative w-screen mt-8 h-fit">
            <div className="absolute left-5 right-5 h-64 overflow-hidden rounded-2xl">
              <img
                src="/ui-images/chat.jpg"
                alt="chat background"
                className="w-full h-full object-cover object-center hover:scale-105 transition-all duration-300 brightness-75"
              />
            </div>
            <div className="absolute top-5 md:top-10 left-12 md:left-16 text-2xl md:text-4xl text-white font-bold">
              Community & Chat
            </div>
            <div className="absolute md:top-24 top-16 left-12 md:left-16 text-white text-sm md:text-xl md:w-1/2 w-[80%]">
              Connect with like-minded individuals, join discussions and
              collaborate on projects that make a difference.
            </div>
            <button
              onClick={() => setShowDiscussionForm(true)}
              className="absolute md:top-44 top-36 left-12 md:left-16 bg-emerald-500 text-white rounded-md px-4 py-2"
            >
              Start New Discussion
            </button>
          </header>

          <div className="flex md:flex-row flex-col mx-5 pt-64 mb-5">
            <div className="md:w-2/3 w-full mt-10">
              <h1 className="text-2xl font-medium">Active Discussions</h1>
              <div className="border border-gray-200 flex flex-col gap-5 rounded-lg mt-5 p-5 md:min-h-[50vh] h-[40vh] overflow-y-scroll">
                {/*discussion list*/}
                {allDiscussions.map((discussion) => (
                  <div className="border border-gray-200 rounded-lg flex p-3 ">
                    <div className="w-5/6 flex">
                      <div className="flex flex-col ">
                        <div className="text-lg font-medium px-2">
                          {discussion.title}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <div className="flex gap-1 flex-wrap">
                            {discussion.tags?.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs bg-gray-200 w-fit rounded-full px-2"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <span className="text-sm text-gray-500 m-1 truncate max-w-[15rem] md:max-w-xs px-2 overflow-hidden">
                            {discussion.description}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/6 text-emerald-500 flex items-center justify-center">
                      <Link
                        to={`/chat/${discussion._id}`}
                        className="px-3 py-1 hover:bg-gray-100 rounded-md transition-all duration-300 cursor-pointer"
                      >
                        View <span className="md:inline hidden"> -&gt;</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/3 w-full mt-10 md:ml-5">
              <h1 className="text-2xl font-medium">Recent chats</h1>
              <div className="border border-gray-200 mt-5 rounded-lg p-5 flex flex-col gap-5 md:min-h-[50vh] h-[40vh] md:overflow-visible overflow-y-scroll">
                {/* profile */}
                {conversations.map((chat) => {
                  const other = chat.participants.find((p) => p !== user.email);
                  return (
                    <div
                      onClick={() => {
                        setActivePersonalChat(chat._id);
                        navigate("/personal-chat");
                      }}
                      key={chat._id}
                      className="flex gap-5 hover:bg-gray-100 transition-all duration-300 cursor-pointer rounded-lg py-1 px-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 my-auto"></div>
                      <div className="flex flex-col">
                        <span>{userNameMap[other]}</span>
                        <span className="text-gray-500 text-sm">
                          Last message
                        </span>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => navigate("/personal-chat")}
                  className="bg-emerald-500 font-medium text-white rounded-md px-4 py-2 hover:bg-black transition-all duration-300"
                >
                  Go to Chat
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

    // <div className="bg-gray-100 px-10 pt-10">

    //   <header className="flex w-full flex-col mb-10">
    //     <div className="flex justify-between">
    //       <div className="flex flex-col">
    //         <span className="text-2xl font-medium">Community Discussions</span>
    //         <span className="text-gray-500">
    //           Connect, share ideas, and make a difference together
    //         </span>
    //       </div>
    //       <div className="flex py-2 gap-2 font-medium text-lg">
    //         <button className="transition-all duration-300 bg-emerald-500 w-40 text-white hover:bg-black">
    //           New Discussion
    //         </button>
    //         <button className="transition-all duration-300 bg-white border border-gray-300 w-40 hover:bg-black hover:text-white ">
    //           Start Chat
    //         </button>
    //       </div>
    //     </div>
    //     <div className="flex justify-between py-3">
    //       <div className="bg-gray-200 p-2 font-medium">
    //         <span
    //           onClick={() => setchatType("discussion")}
    //           className={`${chatType === "discussion" ? "bg-white text-black" : "bg-gray-200 text-gray-500"} mr-1 px-3 py-1 cursor-pointer`}
    //         >
    //           Discussions
    //         </span>
    //         <span
    //           onClick={() => setchatType("personal")}
    //           className={`${chatType === "personal" ? "bg-white text-black" : "bg-gray-200 text-gray-500"} px-3 py-1 cursor-pointer`}
    //         >
    //           Personal Chats
    //         </span>
    //       </div>

    //       <input
    //         type="text"
    //         placeholder="Search..."
    //         className="border border-gray-300 w-72 px-3 py-1"
    //       />
    //     </div>
    //   </header>

    //   <form>
    //     <input type="text" placeholder="Create a new discussion" value={discussions.title} onChange={(e) => setDiscussions({...discussions, title: e.target.value})} />
    //     <input type="text" placeholder="Description" value={discussions.description} onChange={(e) => setDiscussions({...discussions, description: e.target.value})} />
    //     <button onClick={handleCreateDiscussion}>Create</button>
    //   </form>

    //   {/* chat list */}

    //   { chatType === "discussion" ? (
    //     <div>
    //       { allDiscussions.map((discussion) => (
    //       <div className="flex flex-col w-full border border-gray-300 p-5">
    //     <h1 className="text-xl font-medium">{discussion.title}</h1>
    //     <span className="text-gray-500 mt-3">
    //       description: {discussion.description}
    //     </span>
    //     <div className="flex justify-between">
    //       <button>like</button>
    //       <Link
    //         to={`/chat/${discussion._id}`}
    //         state={{
    //           roomId: "discussion123",
    //           isDiscussion: true,
    //           title: "Discussion Title",
    //         }}
    //         className="text-emerald-500 underline"
    //       >
    //         View
    //       </Link>
    //     </div>
    //   </div>
    //     ))}
    //     </div>
    //     ) : (
    //       <div className="flex flex-col w-full border border-gray-300 p-5">
    //             <ul>
    //     {conversations.map(chat => {
    //       const other = chat.participants.find(p => p !== currentUser.email);
    //       return (
    //         <li key={chat._id} onClick={() => navigate(`/personal-chat/${chat._id}`)}>
    //           Chat with {other}
    //         </li>
    //       );
    //     })}
    //   </ul>
    //     </div>
    //     )}
    // </div>
  );
};

export default CommunityChat;
