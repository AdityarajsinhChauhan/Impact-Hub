import React, { useState, useEffect } from "react";
import { UserCircle, Plus, X, Check } from "lucide-react";
import { updateUserInterests, getUser, updateUserProfile } from "../api/user";

const Profile = ({ user }) => {
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [interests, setInterests] = useState(user?.interests || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userProfile, setUserProfile] = useState(user);

  // Fetch user data to ensure we have the latest info
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        setUserProfile(userData);
        setInterests(userData.interests || []);
        setNewName(userData.name || "");
        setNewBio(userData.bio || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // List of suggested interests for the dropdown
  const suggestedInterests = [
    "Climate Change", 
    "Ocean Conservation", 
    "Renewable Energy", 
    "Sustainable Living",
    "Wildlife Protection",
    "Zero Waste",
    "Circular Economy",
    "Veganism",
    "Environmental Justice",
    "Green Technology"
  ];

  // Filter suggestions that aren't already in the user's interests
  const filteredSuggestions = suggestedInterests.filter(
    suggestion => !interests.includes(suggestion) && 
    (newInterest === "" || suggestion.toLowerCase().includes(newInterest.toLowerCase()))
  );

  const updateUserData = async (field, value) => {
    setIsLoading(true);
    try {
      // Call the API to update the user profile
      await updateUserProfile({ [field]: value });
      
      // Update local state
      setUserProfile(prev => ({ ...prev, [field]: value }));
      setSuccessMessage(`Your ${field} has been updated successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Reset edit states
      if (field === 'name') setIsEditingName(false);
      if (field === 'bio') setIsEditingBio(false);
      
      return true;
    } catch (err) {
      setError(`Failed to update your ${field}. Please try again.`);
      setTimeout(() => setError(""), 3000);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      setError("Name cannot be empty");
      setTimeout(() => setError(""), 3000);
      return;
    }
    const success = await updateUserData('name', newName.trim());
    if (success) setIsEditingName(false);
  };

  const handleBioUpdate = async () => {
    const success = await updateUserData('bio', newBio.trim());
    if (success) setIsEditingBio(false);
  };

  const addInterest = async () => {
    if (!newInterest.trim()) return;
    
    // Prevent duplicates
    if (interests.includes(newInterest.trim())) {
      setError("This interest is already in your list");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setIsLoading(true);
    const updatedInterests = [...interests, newInterest.trim()];
    
    try {
      await updateUserInterests(updatedInterests);
      setInterests(updatedInterests);
      setNewInterest("");
      setSuccessMessage("Interest added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to update interests. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const removeInterest = async (interestToRemove) => {
    setIsLoading(true);
    const updatedInterests = interests.filter(interest => interest !== interestToRemove);
    
    try {
      await updateUserInterests(updatedInterests);
      setInterests(updatedInterests);
      setSuccessMessage("Interest removed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to remove interest. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setNewInterest(suggestion);
  };

  if (!userProfile) {
    return (
      <div className="w-full min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Loading profile...</h2>
          <div className="animate-spin h-10 w-10 border-4 border-emerald-500 rounded-full border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile header with photo */}
        <div className="bg-emerald-500 h-48 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="bg-gray-900 h-32 w-32 rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <UserCircle size={100} className="text-gray-200" />
            </div>
          </div>
        </div>

        <div className="pt-20 pb-8 px-8">
          {/* Success and error messages */}
          {successMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Profile info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center">
              {isEditingName ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-2xl font-bold p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Your name"
                  />
                  <button 
                    onClick={handleNameUpdate}
                    disabled={isLoading}
                    className="ml-2 p-1 text-emerald-600 hover:text-emerald-800"
                  >
                    <Check size={20} />
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingName(false);
                      setNewName(userProfile.name || "");
                    }}
                    className="ml-1 p-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="ml-2 text-emerald-600 hover:text-emerald-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-gray-600">{userProfile.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">About</h2>
              <button 
                onClick={() => setIsEditingBio(!isEditingBio)}
                className={`text-sm px-3 py-1 ${isEditingBio ? 'bg-emerald-500 text-white' : 'text-emerald-600 border border-emerald-600'} rounded-full hover:bg-emerald-600 hover:text-white transition-colors`}
              >
                {isEditingBio ? "Done" : "Edit About"}
              </button>
            </div>
            
            {isEditingBio ? (
              <div className="mb-4">
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Tell us about yourself..."
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => {
                      setIsEditingBio(false);
                      setNewBio(userProfile.bio || "");
                    }}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 mr-2"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleBioUpdate}
                    disabled={isLoading}
                    className="px-4 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">
                {userProfile.bio || "No bio added yet. Tell us about yourself!"}
              </p>
            )}
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Interests</h2>
              <button 
                onClick={() => setIsEditingInterests(!isEditingInterests)}
                className={`text-sm px-3 py-1 ${isEditingInterests ? 'bg-emerald-500 text-white' : 'text-emerald-600 border border-emerald-600'} rounded-full hover:bg-emerald-600 hover:text-white transition-colors`}
              >
                {isEditingInterests ? "Done" : "Edit Interests"}
              </button>
            </div>

            {/* Add new interest input - shown only in edit mode */}
            {isEditingInterests && (
              <div className="mb-4">
                <div className="flex relative">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => {
                      // Delay hiding suggestions to allow clicking on them
                      setTimeout(() => setIsInputFocused(false), 200);
                    }}
                    placeholder="Add a new interest..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={addInterest}
                    disabled={isLoading || !newInterest.trim()}
                    className="ml-2 p-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                    ) : (
                      <Plus size={20} />
                    )}
                  </button>
                </div>
                
                {/* Suggestions dropdown */}
                {isInputFocused && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="p-2 bg-gray-50 border-b border-gray-200">
                      <p className="text-sm text-gray-500">Select an interest or type your own</p>
                    </div>
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-emerald-50 cursor-pointer"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Display interests */}
            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                  >
                    {interest}
                    {isEditingInterests && (
                      <button
                        onClick={() => removeInterest(interest)}
                        className="ml-1 text-emerald-800 hover:text-red-500 transition-colors"
                        aria-label={`Remove ${interest}`}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center border border-dashed border-gray-300">
                <p className="text-gray-500 mb-3">No interests added yet.</p>
                {!isEditingInterests && (
                  <button
                    onClick={() => setIsEditingInterests(true)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors text-sm"
                  >
                    Add your first interest
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6">
            <h2 className="text-xl font-semibold mb-4">Activity</h2>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500">Your recent activity will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 