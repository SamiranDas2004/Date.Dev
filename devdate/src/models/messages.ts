import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  fromUser: { type: String, required: true },
  toUser: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
