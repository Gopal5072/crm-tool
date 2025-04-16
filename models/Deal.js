import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    companyName: String,
    pocName: String,
    pocEmail: String,
    stage: String,
    addedBy: String,
    comments: String,
    linkedinUrl: String,
  },
  {
    timestamps: true, // 👈 This auto-manages `createdAt` and `updatedAt`
  }
);

export default mongoose.models.Deal || mongoose.model("Deal", dealSchema);
