const { cartService, productService } = require("../service/index");
const { cartModel } = require("../models/cart.model");

class CartsController {
  createCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const cartId = req.session.user.cart;
      const cart = await cartModel.findById(cartId);
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      const existingProduct = cart.products.find((product) => product.product.toString() === productId);
      if (existingProduct) {
        existingProduct.quantity += Number(quantity);
      } else {
        cart.products.push({ product: productId, quantity: Number(quantity) });
      }
      await cart.save();
      res.send({ status: "success", payload: cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getCart = async (req, res) => {
    try {
      const cart = await cartService
        .getCartById(req.params.cid)
        .populate("products", "-_id -__v");
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      res.json({ status: "success", payload: cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  addProducttoCart = async (req, res) => {
    try {
      const cart = await cartService.getCartById(req.params.cid);
      const product = await productService.getProductById(req.params.pid);
      if (cart && product) {
        const productIndex = cart.products.findIndex(
          (p) => p.id.toString() === req.params.pid
        );
        productIndex >= 0
          ? cart.products[productIndex].quantity++
          : cart.products.push({ id: product._id, quantity: 1 });
        await cartService.saveCart(cart);
        res.json({ status: "success", payload: cart });
      } else {
        res.status(404).json({ error: `Product or Cart not found` });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  updateCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartService.getCartById(cartId);
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      const { products } = req.body;
      if (!Array.isArray(products)) return res.status(400).json({ error: "Invalid products array" });
      cart.products = products;
      const updatedCart = await cartService.saveCart(cart);
      res.json({ status: "success", payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  updateProductinCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const cart = await cartService.getCartById(cartId);
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      const productIndex = cart.products.findIndex((p) => p.id.toString() === productId);
      if (productIndex === -1) return res.status(404).json({ error: "Product not found in Cart" });
      const newQuantity = parseInt(req.body.quantity);
      if (isNaN(newQuantity))
        return res.status(400).json({ error: "Invalid quantity value" });
      cart.products[productIndex].quantity = newQuantity;
      const updatedCart = await cartService.saveCart(cart);
      res.json({ status: "success", payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  deleteCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartService.getCartById(cartId);
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      cart.products = [];
      const updatedCart = await cartService.saveCart(cart);
      res.json({ status: "success", payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  deleteProductinCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const cart = await cartService.getCartById(cartId);
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      const productIndex = cart.products.findIndex((p) => p.id.toString() === productId);
      if (productIndex === -1) return res.status(404).json({ error: "Product not found in Cart" });
      cart.products.splice(productIndex, 1);
      const updatedCart = await cartService.saveCart(cart);
      res.json({ status: "success", payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CartsController();