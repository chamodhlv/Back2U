import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClaimsByItem, approveClaim, rejectClaim } from "../services/foundItemService";

const ManageClaims = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const res = await getClaimsByItem(id);
      setClaims(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching claims:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (claimId) => {
    if (window.confirm("Are you sure you want to approve this claim? This will mark the item as Returned and reject all other claims.")) {
      try {
        await approveClaim(claimId);
        alert("Claim approved! Item marked as Returned.");
        fetchClaims();
      } catch (error) {
        alert("Error approving claim: " + error.message);
      }
    }
  };

  const handleReject = async (claimId) => {
    if (window.confirm("Are you sure you want to reject this claim?")) {
      try {
        await rejectClaim(claimId);
        alert("Claim rejected.");
        fetchClaims();
      } catch (error) {
        alert("Error rejecting claim: " + error.message);
      }
    }
  };

  if (loading) return <p className="p-5">Loading claims...</p>;

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <button onClick={() => navigate(`/found/${id}`)} className="mb-5 px-4 py-2 cursor-pointer bg-gray-200 border-none rounded hover:bg-gray-300">
        ← Back to Item
      </button>

      <h2 className="text-2xl font-bold mb-3">Manage Claims</h2>
      <p className="text-gray-600 mb-5">
        Review and approve/reject claims for this item. Only the finder should access this page.
      </p>

      {claims.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          No claims submitted yet.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {claims.map((claim) => (
            <div
              key={claim._id}
              className={`border p-5 rounded-lg ${
                claim.status === "Approved" ? "bg-green-50 border-green-200" : 
                claim.status === "Rejected" ? "bg-red-50 border-red-200" : 
                "bg-white border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{claim.claimantName}</h3>
                  <p className="mb-1"><strong>Email:</strong> {claim.claimantEmail}</p>
                  {claim.claimantPhone && <p className="mb-1"><strong>Phone:</strong> {claim.claimantPhone}</p>}
                  <p className="mt-3 mb-1 font-semibold">Message:</p>
                  <p className="whitespace-pre-wrap bg-gray-100 p-3 rounded mb-3">
                    {claim.message}
                  </p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Submitted:</strong> {new Date(claim.createdAt).toLocaleString()}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`font-bold ${
                      claim.status === "Approved" ? "text-green-600" : 
                      claim.status === "Rejected" ? "text-red-600" : 
                      "text-orange-600"
                    }`}>
                      {claim.status}
                    </span>
                  </p>
                </div>

                {claim.proofImage && (
                  <div className="ml-5">
                    <img
                      src={`http://localhost:5000/uploads/${claim.proofImage}`}
                      alt="Proof"
                      className="max-w-xs max-h-48 object-contain rounded"
                    />
                  </div>
                )}
              </div>

              {claim.status === "Pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleApprove(claim._id)}
                    className="px-5 py-2 cursor-pointer bg-green-500 text-white border-none rounded hover:bg-green-600"
                  >
                    Approve & Return Item
                  </button>
                  <button
                    onClick={() => handleReject(claim._id)}
                    className="px-5 py-2 cursor-pointer bg-red-500 text-white border-none rounded hover:bg-red-600"
                  >
                    Reject Claim
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageClaims;
