"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DealForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    pocs: [{ name: "", email: "", mobile: "", linkedinUrl: "" }],
    stage: "Mail sent",
    comments: "",
    linkedinUrl: "",
  });

  const [addedBy, setAddedBy] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fullName = localStorage.getItem("fullName");
    if (fullName) setAddedBy(fullName);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePocChange = (index, field, value) => {
    const updatedPOCs = [...formData.pocs];
    updatedPOCs[index][field] = value;
    setFormData({ ...formData, pocs: updatedPOCs });
  };

  const addPocField = () => {
    setFormData({
      ...formData,
      pocs: [...formData.pocs, { name: "", email: "", mobile: "", linkedinUrl: "" }],
    });
  };

  const removePocField = (index) => {
    const updatedPOCs = formData.pocs.filter((_, i) => i !== index);
    setFormData({ ...formData, pocs: updatedPOCs });
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

  return (
    <div style={{ padding: 30, backgroundColor: "#121212", color: "#fff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Create New Deal</h1>

      <div style={{ marginBottom: "30px" }}>
        <Link href="/dashboard/my-deals">
          <button style={navButtonStyle}>📄 View My Deals</button>
        </Link>
        <Link href="/all-deals">
          <button style={navButtonStyle}>🌐 View All Deals</button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <h3>Point of Contacts (POCs):</h3>
{formData.pocs.map((poc, index) => (
  <div key={index} style={pocCardStyle}>
    <div style={formGroupStyle}>
      <label>POC Name:</label>
      <input
        type="text"
        value={poc.name}
        onChange={(e) => handlePocChange(index, "name", e.target.value)}
        required
        style={inputStyle}
      />
    </div>
    <div style={formGroupStyle}>
      <label>POC Email:</label>
      <input
        type="email"
        value={poc.email}
        onChange={(e) => handlePocChange(index, "email", e.target.value)}
        style={inputStyle}
      />
    </div>
    <div style={formGroupStyle}>
      <label>POC Mobile:</label>
      <input
        type="tel"
        value={poc.mobile}
        onChange={(e) => handlePocChange(index, "mobile", e.target.value)}
        style={inputStyle}
      />
    </div>
    <div style={formGroupStyle}>
      <label>POC LinkedIn URL:</label>
      <input
        type="url"
        value={poc.linkedinUrl}
        onChange={(e) => handlePocChange(index, "linkedinUrl", e.target.value)}
        style={inputStyle}
      />
    </div>
    {formData.pocs.length > 1 && (
      <button
        type="button"
        onClick={() => removePocField(index)}
        style={removeBtnStyle}
      >
        ❌ Remove POC
      </button>
    )}
  </div>
))}

        <button type="button" onClick={addPocField} style={addBtnStyle}>
          ➕ Add Another POC
        </button>

        <div style={formGroupStyle}>
          <label>Stage:</label>
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            required
            style={inputStyle}
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

        <div style={formGroupStyle}>
          <label>Comments:</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            style={{ ...inputStyle, height: "80px" }}
          />
        </div>

        <button type="submit" style={submitBtnStyle}>
          🚀 Create Deal
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
    </div>
  );
};

export default DealForm;

// 💅 Inline Styles
const formGroupStyle = {
  marginBottom: "15px",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #444",
  backgroundColor: "#1e1e1e",
  color: "#fff",
  width: "100%",
  marginTop: "5px",
};

const navButtonStyle = {
  padding: "10px 20px",
  marginRight: "10px",
  backgroundColor: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const submitBtnStyle = {
  ...navButtonStyle,
  backgroundColor: "#28a745",
  marginTop: "20px",
};

const addBtnStyle = {
  ...navButtonStyle,
  backgroundColor: "#007bff",
  marginBottom: "20px",
};

const removeBtnStyle = {
  ...navButtonStyle,
  backgroundColor: "#dc3545",
  marginTop: "10px",
};

const pocCardStyle = {
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "15px",
  marginBottom: "15px",
  backgroundColor: "#1a1a1a",
};
