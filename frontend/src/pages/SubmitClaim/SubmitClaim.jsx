import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitClaim } from "../services/foundItemService";

const SubmitClaim = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    claimantName: "",
    claimantEmail: "",
    claimantPhone: "",
    message: ""
  });

  const [proofImage, setProofImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    
    if (proofImage) {
      formData.append("proofImage", proofImage);
    }

    try {
      await submitClaim(id, formData);
      alert("Claim submitted successfully! The finder will review your claim.");
      navigate(`/found/${id}`);
    } catch (error) {
      alert("Error submitting claim: " + error.message);
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <button onClick={() => navigate(`/found/${id}`)} className="mb-5 px-4 py-2 cursor-pointer bg-gray-200 border-none rounded hover:bg-gray-300">
        ← Back to Item
      </button>

      <h2 className="text-2xl font-bold mb-3">Submit Claim</h2>
      <p className="text-gray-600 mb-5">
        Please provide details to prove this item belongs to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="claimantName"
            placeholder="Your Name *"
            onChange={handleChange}
            value={form.claimantName}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="email"
            name="claimantEmail"
            placeholder="Your Email *"
            onChange={handleChange}
            value={form.claimantEmail}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="tel"
            name="claimantPhone"
            placeholder="Your Phone Number"
            onChange={handleChange}
            value={form.claimantPhone}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <textarea
            name="message"
            placeholder="Describe the item and provide proof of ownership *"
            onChange={handleChange}
            value={form.message}
            required
            rows="5"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Upload Proof Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Proof Preview"
              className="mt-3 max-w-xs max-h-48 rounded"
            />
          )}
        </div>

        <button type="submit" className="px-5 py-3 cursor-pointer bg-green-500 text-white border-none rounded hover:bg-green-600 font-medium">
          Submit Claim
        </button>
      </form>
    </div>
  );
};

export default SubmitClaim;
