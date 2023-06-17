const { Schema, model } = require("mongoose");

const collection = "products";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  code: {
    type: String,
    unique: true,
    required: true,
  },
  price: Number,
  stock: Number,
  category: String,
  thumbnail: String,
});

const productModel = model(collection, productSchema);

module.exports = {
  productModel,
};
