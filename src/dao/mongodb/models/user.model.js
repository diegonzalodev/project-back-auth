const { Schema, model } = require("mongoose");

const collection = "users-hash";

const userSchema = new Schema({
  first_name: {
    type: String,
    index: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

const userModel = model(collection, userSchema);

module.exports = {
  userModel,
};
