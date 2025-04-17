'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const MyDealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDealId, setEditingDealId] = useState(null);
  const [editedDealData, setEditedDealData] = useState({});

  useEffect(() => {
    const fetchDeals = async () => {
      const fullName = localStorage.getItem('fullName'); // Use fullName here
      if (!fullName) return;

      try {
        const res = await axios.get(`/api/deals?addedBy=${encodeURIComponent(fullName)}`);
        setDeals(res.data);
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleEditClick = (deal) => {
    setEditingDealId(deal._id);
    setEditedDealData({ ...deal });
  };

  const handleEditChange = (e) => {
    setEditedDealData({
      ...editedDealData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async (dealId) => {
    try {
      await axios.put(`/api/deals/${dealId}`, editedDealData);
      setDeals((prevDeals) =>
        prevDeals.map((deal) => (deal._id === dealId ? { ...deal, ...editedDealData } : deal))
      );
      setEditingDealId(null); // Exit edit mode
    } catch (error) {
      console.error('Failed to save edited deal:', error);
      alert('Failed to save deal');
    }
  };

  // Handle Deal Deletion
  const handleDeleteDeal = async (dealId) => {
    try {
      await axios.delete(`/api/deals/${dealId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // After deletion, update the state to reflect the change in the UI
      setDeals((prevDeals) => prevDeals.filter((deal) => deal._id !== dealId));
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Failed to delete deal');
    }
  };

  if (loading) return <p>Loading deals...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>My Deals</h1>
      {deals.length === 0 ? (
        <p>No deals found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>POC Name</th>
              <th>POC Email</th>
              <th>POC Mobile</th>
              <th>Stage</th>
              <th>Added By</th>
              <th>LinkedIn</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal._id}>
                <td>
                  {editingDealId === deal._id ? (
                    <input
                      type="text"
                      name="companyName"
                      value={editedDealData.companyName}
                      onChange={handleEditChange}
                    />
                  ) : (
                    deal.companyName
                  )}
                </td>
                <td>
                  {editingDealId === deal._id ? (
                    <input
                      type="text"
                      name="pocName"
                      value={editedDealData.pocName}
                      onChange={handleEditChange}
                    />
                  ) : (
                    deal.pocName
                  )}
                </td>
                <td>
                  {editingDealId === deal._id ? (
                    <input
                      type="email"
                      name="pocEmail"
                      value={editedDealData.pocEmail}
                      onChange={handleEditChange}
                    />
                  ) : (
                    deal.pocEmail
                  )}
                </td>
                <td>
  {editingDealId === deal._id ? (
    <input
      type="tel"
      name="pocMobile"
      value={editedDealData.pocMobile || ""}
      onChange={handleEditChange}
    />
  ) : (
    deal.pocMobile || "-"
  )}
</td>

                <td>
                  {editingDealId === deal._id ? (
                    <select
                      name="stage"
                      value={editedDealData.stage}
                      onChange={handleEditChange}
                    >
                      <option value="Mail sent">Mail sent</option>
                      <option value="Proposal sent">Proposal sent</option>
                      <option value="Meeting done">Meeting done</option>
                      <option value="Meeting scheduled">Meeting scheduled</option>
                      <option value="Sampling stage">Sampling stage</option>
                      <option value="Closed Won">Closed Won</option>
                      <option value="Closed Lost">Closed Lost</option>
                      <option value="DNP">DNP</option>
                    </select>
                  ) : (
                    deal.stage
                  )}
                </td>
                <td>
                  {editingDealId === deal._id ? (
                    <input
                      type="text"
                      name="addedBy"
                      value={editedDealData.addedBy}
                      readOnly
                    />
                  ) : (
                    deal.addedBy
                  )}
                </td>
                <td>
  {editingDealId === deal._id ? (
    <input
      type="url"
      name="linkedinUrl"
      value={editedDealData.linkedinUrl || ""}
      onChange={handleEditChange}
    />
  ) : (
    deal.linkedinUrl ? (
      <a
        href={deal.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {deal.linkedinUrl}
      </a>
    ) : (
      "-"
    )
  )}
</td>


                <td>
  {editingDealId === deal._id ? (
    <input
      type="text"
      name="createdAt"
      value={new Date(editedDealData.createdAt).toLocaleString()}
      readOnly
    />
  ) : (
    new Date(deal.createdAt).toLocaleString()
  )}
</td>
<td>
  {editingDealId === deal._id ? (
    <input
      type="text"
      name="updatedAt"
      value={new Date(editedDealData.updatedAt).toLocaleString()}
      readOnly
    />
  ) : (
    new Date(deal.updatedAt).toLocaleString()
  )}
</td>
                <td>
                  {editingDealId === deal._id ? (
                    <input
                      type="text"
                      name="comments"
                      value={editedDealData.comments}
                      onChange={handleEditChange}
                    />
                  ) : (
                    deal.comments
                  )}
                </td>
                <td>
                  {editingDealId === deal._id ? (
                    <>
                      <button onClick={() => handleSaveEdit(deal._id)}>Save</button>
                      <button onClick={() => setEditingDealId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(deal)}>Edit</button>
                      <button onClick={() => handleDeleteDeal(deal._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyDealsPage;
