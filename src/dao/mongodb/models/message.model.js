const { Schema, model } = require("mongoose");

const collection = "messages";

const messageSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
  }
});

const messageModel = model(collection, messageSchema);

module.exports = {
  messageModel
};
