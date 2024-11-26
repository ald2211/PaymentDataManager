import mongoose from "mongoose";

const detailsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  card: {
    type: String,
    required: true
  },
  consignee: {
    type: String,
    required: true
  },
  remark: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  }
},{timestamps:true});

export default mongoose.model("Details", detailsSchema);