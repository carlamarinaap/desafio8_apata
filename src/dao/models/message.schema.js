import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  user: String,
  message: String,
});

export default mongoose.model("Messages", MessageSchema);
