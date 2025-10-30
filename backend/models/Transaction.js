import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["income", "expense"] },
  amount: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
});

export default mongoose.model("Transaction", transactionSchema);
