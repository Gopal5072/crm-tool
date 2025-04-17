"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const DealForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    pocName: "",
    pocEmail: "",
    pocMobile: "",
    stage: "Mail sent",
    comments: "",
    linkedinUrl: "",
  });

  const [addedBy, setAddedBy] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fullName = localStorage.getItem("fullName");
    if (fullName) {
      setAddedBy(fullName);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "/api/deals",
        { ...formData, addedBy },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      router.push("/dashboard/my-deals");
    } catch (err) {
      setError("Error creating deal");
    }
  };

  const handleShowMyDeals = () => {
    router.push("/dashboard/my-deals");
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Create New Deal</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="pocName">POC Name:</label>
          <input
            type="text"
            id="pocName"
            name="pocName"
            value={formData.pocName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="pocEmail">POC Email:</label>
          <input
            type="email"
            id="pocEmail"
            name="pocEmail"
            value={formData.pocEmail}
            onChange={handleChange}
          />
        </div>

        <div>
      <label htmlFor="pocMobile">POC Mobile Number:</label>
        <input
        type="tel"
        id="pocMobile"
        name="pocMobile"
        value={formData.pocMobile}
        onChange={handleChange}
            />
          </div>

        <div>
          <label htmlFor="stage">Stage:</label>
          <select
            id="stage"
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            required
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
        </div>

        <div>
          <label htmlFor="linkedinUrl">LinkedIn Profile URL:</label>
          <input
            type="url"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
  />
        </div>
        
        <div>
          <label htmlFor="comments">Comments:</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
          />
        </div>

        <div>
          <button type="submit">Create Deal</button>
          <button onClick={handleShowMyDeals}>Show My Deals</button>
          <button type="button" onClick={() => router.push("/all-deals")}>
    Show All Deals
  </button>
        </div>
      </form>

      <br />

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DealForm;
