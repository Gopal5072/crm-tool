'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AllDealsPage = () => {
  const router = useRouter();
  const [deals, setDeals] = useState([]);
  const [salesNames, setSalesNames] = useState([]);
  const [filterBy, setFilterBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // For redirect check

  // Redirect unauthenticated users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthChecked(true);
    }
  }, []);

  // Fetch deals and names only after auth check
  useEffect(() => {
    if (!authChecked) return;

    fetchDeals();
    fetchSalesNames();
  }, [filterBy, authChecked]);

  const fetchDeals = async () => {
    try {
      const res = await axios.get(`/api/deals${filterBy ? `?addedBy=${encodeURIComponent(filterBy)}` : ''}`);
      setDeals(res.data);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesNames = async () => {
    try {
      const res = await axios.get('/api/deals');
      const names = [...new Set(res.data.map((deal) => deal.addedBy))];
      setSalesNames(names.sort());
    } catch (error) {
      console.error('Failed to fetch sales names:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
    setLoading(true);
  };

  if (!authChecked) return <p>Checking authentication...</p>;
  if (loading) return <p>Loading deals...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>All Deals (Founder View)</h1>

      <label>Filter by Sales Member:</label>
      <select value={filterBy} onChange={handleFilterChange}>
        <option value="">All</option>
        {salesNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Company</th>
            <th>POC</th>
            <th>Email</th>
            <th>Stage</th>
            <th>Added By</th>
            <th>LinkedIn URL</th>
            <th>Created</th>
            <th>Updated</th>
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
              <td>
                {deal.linkedinUrl ? (
                  <a href={deal.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    View Profile
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td>{new Date(deal.createdAt).toLocaleString()}</td>
              <td>{new Date(deal.updatedAt).toLocaleString()}</td>
              <td>{deal.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllDealsPage;
