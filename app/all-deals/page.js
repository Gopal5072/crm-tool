'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AllDealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [salesNames, setSalesNames] = useState([]);
  const [filterBy, setFilterBy] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role) router.push('/login');
    fetchDeals();
    fetchSalesNames();
  }, [filterBy]);

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
  };

  if (loading) return <p>Loading deals...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>All Deals (Founder View)</h1>
      <label>Filter by Sales Member:</label>
      <select value={filterBy} onChange={handleFilterChange}>
        <option value="">All</option>
        {salesNames.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllDealsPage;
