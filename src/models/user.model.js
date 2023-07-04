const { Schema, model } = require("mongoose");

const collection = "users-hash";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "cartModel",
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
});

const userModel = model(collection, userSchema);

module.exports = {
  userModel,
};
