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
              <th>Company</th>
              <th>POC Name(s)</th>
              <th>POC Email(s)</th>
              <th>POC Mobile(s)</th>
              <th>POC LinkedIn(s)</th>
              <th>Stage</th>
              <th>Added By</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal._id}>
                <td>{deal.companyName}</td>

                {/* POC Names */}
                <td>
                  <ul>
                    {deal.pocs && deal.pocs.length > 0 ? (
                      deal.pocs.map((poc, i) => <li key={i}>{poc.name}</li>)
                    ) : (
                      <li>{deal.pocName || '-'}</li>
                    )}
                  </ul>
                </td>

                {/* POC Emails */}
                <td>
                  <ul>
                    {deal.pocs && deal.pocs.length > 0 ? (
                      deal.pocs.map((poc, i) => <li key={i}>{poc.email}</li>)
                    ) : (
                      <li>{deal.pocEmail || '-'}</li>
                    )}
                  </ul>
                </td>

                {/* POC Mobiles */}
                <td>
                  <ul>
                    {deal.pocs && deal.pocs.length > 0 ? (
                      deal.pocs.map((poc, i) => <li key={i}>{poc.mobile}</li>)
                    ) : (
                      <li>{deal.pocMobile || '-'}</li>
                    )}
                  </ul>
                </td>

                {/* POC LinkedIn URLs */}
                <td>
  <ul>
    {deal.pocs?.length > 0 ? (
      deal.pocs.map((poc, i) => (
        <li key={i}>
          {poc.linkedinUrl ? (
            <a href={poc.linkedinUrl} target="_blank" rel="noopener noreferrer">
              {poc.linkedinUrl}
            </a>
          ) : '-'}
        </li>
      ))
    ) : deal.linkedinUrl ? (
      <li>
        <a href={deal.linkedinUrl} target="_blank" rel="noopener noreferrer">
          {deal.linkedinUrl}
        </a>
      </li>
    ) : (
      <li>-</li>
    )}
  </ul>
</td>



                <td>{deal.stage}</td>
                <td>{deal.addedBy}</td>
                <td>{new Date(deal.createdAt).toLocaleString()}</td>
                <td>{new Date(deal.updatedAt).toLocaleString()}</td>
                <td>{deal.comments}</td>
                <td>
                  <button onClick={() => handleEditClick(deal)}>Edit</button>
                  <button onClick={() => handleDeleteDeal(deal._id)}>Delete</button>
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
