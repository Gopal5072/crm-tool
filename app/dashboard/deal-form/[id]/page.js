// app/dashboard/deal-form/[id]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DealEditForm() {
  const router = useRouter();
  const { id } = router.query;  // Extract deal ID from the router query
  const [deal, setDeal] = useState(null);

  useEffect(() => {
    if (!id) return;  // Wait for the ID to be available

    async function fetchDeal() {
      try {
        const response = await fetch(`/api/deals/${id}`);  // Fetch deal data from API
        const data = await response.json();
        setDeal(data);  // Set the deal data into state
      } catch (error) {
        console.error('Failed to fetch deal:', error);
      }
    }

    fetchDeal();
  }, [id]);  // Re-run when `id` changes

  if (!deal) {
    return <div>Loading...</div>;  // Show loading state while deal is being fetched
  }

  return (
    <div>
      <h1>Edit Deal</h1>
      <form>
        <label>
          Deal Name:
          <input type="text" value={deal.dealName} />
        </label>
        <label>
          Stage:
          <select value={deal.stage}>
            <option value="Mail sent">Mail sent</option>
            <option value="Proposal sent">Proposal sent</option>
            <option value="Meeting done">Meeting done</option>
            <option value="Meeting scheduled">Meeting scheduled</option>
            <option value="Sampling stage">Sampling stage</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
            <option value="DNP">DNP</option>
          </select>
        </label>
        <label>
          Added By:
          <select value={deal.addedBy}>
            <option value="Mehar">Mehar</option>
            <option value="Tanvi">Tanvi</option>
            <option value="Nandini">Nandini</option>
            <option value="Palak">Palak</option>
            <option value="Gopal">Gopal</option>
          </select>
        </label>
      </form>
    </div>
  );
}
