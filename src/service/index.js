const CartDaoMemory = require("../dao/CartDaoMemory");
const ProductDaoMemory = require("../dao/ProductDaoMemory");

const cartService = new CartDaoMemory();
const productService = new ProductDaoMemory();

module.exports = {
  cartService,
  productService
}
