import React, { useState } from "react";
import { saveOpportunity } from "../api/opportunity";

const AddOpportunityForm = ({ showForm, setShowForm }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
    eligibility: "",
    deadline: "",
    organization: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.link) newErrors.link = "Link is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await saveOpportunity(formData);
      console.log(response);
      setFormData({
        title: "",
        description: "",
        category: "",
        link: "",
        eligibility: "",
        deadline: "",
      });
      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl fixed z-50 left-1/2 -translate-x-1/2 mx-auto bg-white p-6 shadow-lg rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Add New Opportunity
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Funding">Funding</option>
            <option value="Volunteering">Volunteering</option>
            <option value="Skill Building">Skill Building</option>
            <option value="Internships">Internships</option>
            <option value="NGO">NGO</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Link *</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.link && <p className="text-red-500 text-sm">{errors.link}</p>}
        </div>

        <div>
          <label className="block mb-2">Organization / Name *</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.organization && (
            <p className="text-red-500 text-sm">{errors.organization}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Eligibility (Optional)</label>
          <input
            type="text"
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Deadline (Optional)</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="bg-gray-500 text-white w-1/2 px-4 py-2 rounded hover:bg-gray-700"
        >
          Close
        </button>
        <button
          type="submit"
          className="bg-emerald-500 text-white w-1/2 px-4 py-2 rounded hover:bg-black"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default AddOpportunityForm;
