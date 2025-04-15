// app/dashboard/page.jsx or app/dashboard/my-deals/page.jsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const MyDealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ padding: 30 }}>
      <h1>My Deals</h1>
      {loading ? (
        <p>Loading deals...</p>
      ) : (
        <>
          {deals.length === 0 ? (
            <p>No deals found.</p>
          ) : (
            <table border="1" cellPadding="10">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>POC Name</th>
                  <th>POC Email</th>
                  <th>Stage</th>
                  <th>Added By</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr key={deal._id}>
                    <td>{deal.companyName}</td>
                    <td>{deal.pocName}</td>
                    <td>{deal.pocEmail}</td>
                    <td>{deal.stage}</td>
                    <td>{deal.addedBy}</td>
                    <td>{deal.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default MyDealsPage;
