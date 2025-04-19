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
      const fullName = localStorage.getItem('fullName');
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
    const { name, value } = e.target;
    setEditedDealData(prev => ({ ...prev, [name]: value }));
  };

  const handlePocChange = (index, field, value) => {
    const updatedPocs = [...editedDealData.pocs];
    updatedPocs[index][field] = value;
    setEditedDealData({ ...editedDealData, pocs: updatedPocs });
  };

  const handleSaveEdit = async (dealId) => {
    try {
      await axios.put(`/api/deals/${dealId}`, editedDealData);
      setDeals((prevDeals) =>
        prevDeals.map((deal) => (deal._id === dealId ? { ...deal, ...editedDealData } : deal))
      );
      setEditingDealId(null);
    } catch (error) {
      console.error('Failed to save edited deal:', error);
      alert('Failed to save deal');
    }
  };

  const handleDeleteDeal = async (dealId) => {
    try {
      await axios.delete(`/api/deals/${dealId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
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
                <td>
                  {editingDealId === deal._id ? (
                    <input
                      name="companyName"
                      value={editedDealData.companyName}
                      onChange={handleEditChange}
                    />
                  ) : (
                    deal.companyName
                  )}
                </td>

                {/* POC Names */}
                <td>
                  <ul>
                    {deal.pocs?.map((poc, i) => (
                      <li key={i}>
                        {editingDealId === deal._id ? (
                          <input
                            value={editedDealData.pocs[i]?.name || ''}
                            onChange={(e) => handlePocChange(i, 'name', e.target.value)}
                          />
                        ) : (
                          poc.name
                        )}
                      </li>
                    ))}
                  </ul>
                </td>

                {/* POC Emails */}
                <td>
                  <ul>
                    {deal.pocs?.map((poc, i) => (
                      <li key={i}>
                        {editingDealId === deal._id ? (
                          <input
                            value={editedDealData.pocs[i]?.email || ''}
                            onChange={(e) => handlePocChange(i, 'email', e.target.value)}
                          />
                        ) : (
                          poc.email
                        )}
                      </li>
                    ))}
                  </ul>
                </td>

                {/* POC Mobiles */}
                <td>
                  <ul>
                    {deal.pocs?.map((poc, i) => (
                      <li key={i}>
                        {editingDealId === deal._id ? (
                          <input
                            value={editedDealData.pocs[i]?.mobile || ''}
                            onChange={(e) => handlePocChange(i, 'mobile', e.target.value)}
                          />
                        ) : (
                          poc.mobile
                        )}
                      </li>
                    ))}
                  </ul>
                </td>

                {/* POC LinkedIn */}
                <td>
                  <ul>
                    {deal.pocs?.map((poc, i) => (
                      <li key={i}>
                        {editingDealId === deal._id ? (
                          <input
                            value={editedDealData.pocs[i]?.linkedinUrl || ''}
                            onChange={(e) => handlePocChange(i, 'linkedinUrl', e.target.value)}
                          />
                        ) : poc.linkedinUrl ? (
                          <a href={poc.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            {poc.linkedinUrl}
                          </a>
                        ) : (
                          '-'
                        )}
                      </li>
                    ))}
                  </ul>
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

                <td>{deal.addedBy}</td>
                <td>{new Date(deal.createdAt).toLocaleString()}</td>
                <td>{new Date(deal.updatedAt).toLocaleString()}</td>

                <td>
                  {editingDealId === deal._id ? (
                    <textarea
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
                      <button onClick={() => handleSaveEdit(deal._id)}>💾 Save</button>
                      <button onClick={() => setEditingDealId(null)}>❌ Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(deal)}>✏️ Edit</button>
                      <button onClick={() => handleDeleteDeal(deal._id)}>🗑️ Delete</button>
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
