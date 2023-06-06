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
  password: {
    type: String,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "cartModel",
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
