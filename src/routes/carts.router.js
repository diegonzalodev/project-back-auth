const { Router } = require("express");
const cartManager = require("../dao/mongodb/CartManagerMongo");
const productManager = require("../dao/mongodb/ProductManagerMongo");

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.send({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager
      .getCartById(req.params.cid)
      .populate("products", "-_id -__v"); // Excluimos los campos _id y __v del populate
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    const product = await productManager.getProductById(req.params.pid);
    if (cart && product) {
      const productIndex = cart.products.findIndex((p) => p.id.toString() === req.params.pid);
      (productIndex >= 0) ? cart.products[productIndex].quantity++ : cart.products.push({ id: product._id, quantity: 1 });
      await cartManager.saveCart(cart);
      res.json({ status: "success", payload: cart });
    } else {
      res.status(404).json({ error: `Product or Cart not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    const { products } = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ error: "Invalid products array" });
    cart.products = products;
    const updatedCart = await cartManager.saveCart(cart);
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await cartManager.getCartById(cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    const productIndex = cart.products.findIndex((p) => p.id.toString() === productId);
    if (productIndex === -1) return res.status(404).json({ error: "Product not found in Cart" });
    const newQuantity = parseInt(req.body.quantity);
    if (isNaN(newQuantity)) return res.status(400).json({ error: "Invalid quantity value" });
    cart.products[productIndex].quantity = newQuantity;
    const updatedCart = await cartManager.saveCart(cart);
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    cart.products = [];
    const updatedCart = await cartManager.saveCart(cart);
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await cartManager.getCartById(cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    const productIndex = cart.products.findIndex((p) => p.id.toString() === productId);
    if (productIndex === -1) return res.status(404).json({ error: "Product not found in Cart" });
    cart.products.splice(productIndex, 1);
    const updatedCart = await cartManager.saveCart(cart);
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
