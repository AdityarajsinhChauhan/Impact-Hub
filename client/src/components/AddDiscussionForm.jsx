import React, { useState } from "react";
import { createDiscussion } from "../api/community";

const AddDiscussionForm = ({ showDiscussionForm, setShowDiscussionForm }) => {
  const tagOptions = [
    "Environment",
    "Technology",
    "Education",
    "Health",
    "Sustainability",
    "Innovation",
    "Community",
    "Equality",
    "Empowerment",
    "Awareness",
    "Action",
    "Research",
    "Social Impact",
    "Global",
    "Local",
    "Youth",
    "Nature",
    "Policy",
    "Accessibility",
    "Science",
  ];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discussion, setDiscussion] = useState({
    title: "",
    description: "",
    tags: [], // <-- new
  });
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (e) => {
    setDiscussion({ ...discussion, [e.target.name]: e.target.value });
  };

  const handleTagSelect = (tag) => {
    if (discussion.tags.length >= 5) return;
    if (!discussion.tags.includes(tag)) {
      setDiscussion({ ...discussion, tags: [...discussion.tags, tag] });
    }
    setSearch("");
    setDropdownOpen(false);
  };

  const removeTag = (tagToRemove) => {
    setDiscussion({ ...discussion, tags: discussion.tags.filter((tag) => tag !== tagToRemove) });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const discussionResponse = await createDiscussion(discussion);
    console.log(discussionResponse);
    setShowDiscussionForm(false);
    setDiscussion({
      title: "",
      description: "",
      tags: [],
    });
  };

  const filteredTags = tagOptions.filter(
    (tag) =>
      tag.toLowerCase().startsWith(search.toLowerCase()) &&
      !discussion.tags.includes(tag)
  );

  return (
    <>
      {showDiscussionForm && (
        <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-black/50 z-50">
          <div className="bg-white rounded-lg p-5 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-medium">Create a new discussion</h1>
              <button
                className="bg-red-500 text-white rounded-md w-6 h-6 p-1 hover:bg-black transition-all duration-300"
                onClick={() => setShowDiscussionForm(false)}
              >
                <img
                  src="/ui-images/close.svg"
                  className="w-4 h-4 invert"
                  alt="close"
                />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={discussion.title}
                name="title"
                onChange={(e) => handleChange(e)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />

              <textarea
                placeholder="Description"
                value={discussion.description}
                name="description"
                onChange={(e) => handleChange(e)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows={4}
                required
              />

              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder="Search and select tags"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {dropdownOpen && (
                  <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto rounded-lg z-10 shadow">
                    {filteredTags.length > 0 ? (
                      filteredTags.map((tag, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleTagSelect(tag)}
                        >
                          {tag}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">No tags found</li>
                    )}
                  </ul>
                )}
                {discussion.tags.length >= 5 && (
                  <p className="text-sm text-red-500 mt-1">
                    Max 5 tags allowed.
                  </p>
                )}
              </div>

              {discussion.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {discussion.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-500 hover:text-red-500"
                        type="button"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Save Discussion
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDiscussionForm;
