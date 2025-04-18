import mongoose from "mongoose";
const pocSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  linkedinUrl: { type: String, required: false }, // Added LinkedIn URL to POC
});

const dealSchema = new mongoose.Schema(
  {
    companyName: String,
    pocs: [pocSchema], // Array of POCs, each with LinkedIn URL
    stage: String,
    addedBy: String,
    comments: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Deal || mongoose.model("Deal", dealSchema);
