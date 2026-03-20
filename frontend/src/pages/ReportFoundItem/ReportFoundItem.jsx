import React, { useState } from "react";
import { createItem } from "../services/foundItemService";
import { useNavigate, Link } from "react-router-dom";

const ReportFoundItem = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    locationFound: "",
    foundDate: "",
    finderName: "",
    finderEmail: ""
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    
    if (image) {
      formData.append("image", image);
    }

    try {
      await createItem(formData);
      alert("Item reported successfully! Status: Claimable");
      navigate("/");
    } catch (error) {
      alert("Error reporting item: " + error.message);
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <div className="mb-5">
        <Link to="/" className="no-underline text-blue-500">
          ← Back to Home
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-5">Report Found Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="title"
            placeholder="Item Title *"
            onChange={handleChange}
            value={form.title}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            name="category"
            onChange={handleChange}
            value={form.category}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category *</option>
            <option value="Electronics">Electronics</option>
            <option value="Documents">Documents</option>
            <option value="Accessories">Accessories</option>
            <option value="Clothing">Clothing</option>
            <option value="Keys">Keys</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <input
            name="locationFound"
            placeholder="Location Found *"
            onChange={handleChange}
            value={form.locationFound}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Date Found *</label>
          <input
            type="date"
            name="foundDate"
            onChange={handleChange}
            value={form.foundDate}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Description (limited for privacy)"
            onChange={handleChange}
            value={form.description}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 max-w-xs max-h-48 rounded"
            />
          )}
        </div>

        <div>
          <input
            name="finderName"
            placeholder="Your Name *"
            onChange={handleChange}
            value={form.finderName}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="email"
            name="finderEmail"
            placeholder="Your Email *"
            onChange={handleChange}
            value={form.finderEmail}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button type="submit" className="px-5 py-3 cursor-pointer bg-blue-500 text-white border-none rounded hover:bg-blue-600 font-medium">
          Submit Found Item
        </button>
      </form>
    </div>
  );
};

export default ReportFoundItem;
