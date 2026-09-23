import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Card name is required"],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Card", cardSchema);
