import React, { useState, useEffect } from "react";
import SlidingNavbar from "../components/SlidingNavbar";
import AddOpportunityForm from "../components/AddOpportunityForm";
import { getOpportunities } from "../api/opportunity";
import Loader from "../components/Loader";

const ActionHub = ({ active, setactive }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    setactive("action hub");
  }, []);
  
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await getOpportunities();
        setOpportunities(response);
        console.log(response);
      } catch (err) {
        console.log(err);
      }finally {
        setIsLoading(false); 
      }
    };
    fetchOpportunities();
    console.log(opportunities);
  }, [showForm]);

  const categoryColors = {
    Funding: "bg-green-500",
    Volunteering: "bg-blue-500",
    "Skill Building": "bg-purple-500",
    Internships: "bg-yellow-500",
    NGO: "bg-red-500",
  };

  // Filter by category and search query
  const filteredData = opportunities
    .filter(opportunity => 
      selectedCategory === "All" || opportunity.category === selectedCategory
    )
    .filter(opportunity => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        opportunity.title?.toLowerCase().includes(query) ||
        opportunity.organization?.toLowerCase().includes(query) ||
        opportunity.description?.toLowerCase().includes(query) ||
        opportunity.eligibility?.toLowerCase().includes(query) ||
        opportunity.category?.toLowerCase().includes(query)
      );
    });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-gray-100">
      {showForm && (
        <AddOpportunityForm showForm={showForm} setShowForm={setShowForm} />
      )}

      {isLoading ? (<Loader text="Loading opportunities..."/>) : (
        <>
        <div className="flex md:flex-row flex-col w-full justify-between">
        <div>
          <h1 className="text-3xl font-bold pt-5 pl-8">Action Hub</h1>
          <div className="text-gray-600 mt-3 pl-8">
            Explore opportunities in funding, volunteering, skill-building, and
            internships.
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-black md:mx-0 mx-5 md:mt-0 mt-5 transition-all duration-300 text-white px-4 py-2 rounded-md hover:bg-emerald-500 h-fit my-auto mr-8 font-bold"><span className="text-xl pr-3">+</span>Add Opportunity</button>
      </div>

      <input 
        type="text" 
        placeholder="Search for opportunities" 
        value={searchQuery}
        onChange={handleSearchChange}
        className="md:w-1/2 w-[85vw] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 md:mx-8 ml-5 mr-5 mt-5" 
      />

      <div className="flex md:mx-8 mx-5 text-xs md:text-base justify-between">
        <SlidingNavbar
          sections={[
            "All",
            "NGO",
            "Funding",
            "Volunteering",
            "Skill-Building",
            "Internships",
          ]}
          activeSection={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <div className="flex flex-col items-center"></div>
      </div>
      <div className="mx-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.length > 0 ? (
            filteredData.map((opportunity, index) => (
              <div
                key={index}
                className="bg-white pb-20 relative p-5 rounded-lg shadow-lg border border-gray-200"
              >
                
                <div className="flex justify-between">
                <h3 className="text-xl font-semibold">{opportunity.title}</h3>
                <span
                    className={`text-white px-3 h-fit py-1 text-sm rounded ${
                      categoryColors[opportunity.category]
                    }`}
                  >
                    {opportunity.category}
                  </span>
                </div>
                <div className="text-gray-500">{opportunity.organization}</div>
                  
                  
                <p className="text-gray-600 mt-5">{opportunity.description}</p>
                  {opportunity.eligibility ? (
                  <p className="text-gray-500 mt-2">
                    <strong>Eligibility:</strong> {opportunity.eligibility}
                  </p>
                ) : (
                  <p className="text-gray-500 mt-5">
                    <strong>Eligibility:</strong> Anyone
                  </p>
                )}
                <p className="text-gray-500 mt-5">
                <strong>Deadline:</strong> {opportunity.deadline ? (
                  <span className="text-gray-500">{opportunity.deadline}</span>
                ) : (
                  <span className="text-gray-500">None</span>
                )}</p>
                <a
                    href={opportunity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-5 left-5 right-5 rounded-md px-auto text-center inline-block bg-emerald-500 text-white px-4 py-2 cursor-pointer transition-all duration-300 hover:bg-black"
                  >
                    Go to {opportunity.category}
                  </a>
              </div>
            ))
          ) : (
            <div className="col-span-3 flex justify-center items-center py-10">
              <p className="text-gray-500 text-lg">No opportunities found matching your search.</p>
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default ActionHub;
