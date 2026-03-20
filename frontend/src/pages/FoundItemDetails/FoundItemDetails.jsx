import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getItem } from "../services/foundItemService";

const FoundItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  const fetchItem = async () => {
    try {
      const res = await getItem(id);
      setItem(res.data);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  };

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!item) return <p className="p-5">Loading...</p>;

  const canClaim = item.status === "Claimable";

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <button onClick={() => navigate("/")} className="mb-5 px-4 py-2 cursor-pointer bg-gray-200 border-none rounded hover:bg-gray-300">
        ← Back to List
      </button>

      <div className="border border-gray-300 p-5 rounded-lg shadow-md">
        {item.image && (
          <img
            src={`http://localhost:5000/uploads/${item.image}`}
            alt={item.title}
            className="w-full max-h-96 object-contain rounded mb-5"
          />
        )}

        <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
        
        <div className="mb-4 space-y-2">
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Location Found:</strong> {item.locationFound}</p>
          <p><strong>Date Found:</strong> {new Date(item.foundDate).toLocaleDateString()}</p>
          <p><strong>Description:</strong> {item.description || "Limited for privacy"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`font-bold ${
              item.status === "Claimable" ? "text-green-600" : 
              item.status === "Returned" ? "text-blue-600" : "text-gray-600"
            }`}>
              {item.status}
            </span>
          </p>
        </div>

        <div className="mt-5">
          <p className="font-semibold">Finder Contact:</p>
          <p>Name: {item.finderName}</p>
          <p>Email: {item.finderEmail}</p>
        </div>

        {canClaim ? (
          <Link to={`/claim/${item._id}`}>
            <button className="px-5 py-3 cursor-pointer mt-5 bg-green-500 text-white border-none rounded hover:bg-green-600">
              Claim This Item
            </button>
          </Link>
        ) : (
          <p className="mt-5 text-gray-600 italic">
            This item is no longer available for claiming (Status: {item.status})
          </p>
        )}

        <Link to={`/manage/${item._id}`} className="ml-3">
          <button className="px-5 py-3 cursor-pointer mt-5 bg-gray-500 text-white border-none rounded hover:bg-gray-600">
            Manage Claims (Finder Only)
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FoundItemDetails;
