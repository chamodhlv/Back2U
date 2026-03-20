import React, { useEffect, useState } from "react";
import { getAllItems } from "../services/foundItemService";
import { Link } from "react-router-dom";

const FoundItemsList = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await getAllItems();
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === "all") return item.status !== "Archived";
    return item.status === filter;
  });

  return (
    <div className="p-5">
      <div className="mb-5">
        <Link to="/" className="no-underline text-blue-500">
          ← Back to Home
        </Link>
      </div>

      <div className="flex justify-between items-center mb-5">
        <h2>Found Items</h2>
        <Link to="/report">
          <button className="px-5 py-2 cursor-pointer bg-blue-500 text-white border-none rounded hover:bg-blue-600">
            Report Found Item
          </button>
        </Link>
      </div>

      <div className="mb-5">
        <label className="mr-2">Filter by Status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border border-gray-300 rounded">
          <option value="all">All Active</option>
          <option value="Claimable">Claimable</option>
          <option value="Returned">Returned</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div key={item._id} className="border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {item.image && (
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="mb-1"><strong>Category:</strong> {item.category}</p>
            <p className="mb-1"><strong>Location:</strong> {item.locationFound}</p>
            <p className="mb-1"><strong>Date:</strong> {new Date(item.foundDate).toLocaleDateString()}</p>
            <p className="mb-3">
              <strong>Status:</strong>{" "}
              <span className={`font-bold ${
                item.status === "Claimable" ? "text-green-600" : 
                item.status === "Returned" ? "text-blue-600" : "text-gray-600"
              }`}>
                {item.status}
              </span>
            </p>

            <Link to={`/found/${item._id}`}>
              <button className="px-4 py-2 cursor-pointer mt-3 bg-blue-500 text-white border-none rounded hover:bg-blue-600">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center mt-10 text-gray-600">
          No items found
        </p>
      )}
    </div>
  );
};

export default FoundItemsList;
