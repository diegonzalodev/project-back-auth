const { v4: uuidv4 } = require("uuid");
const { cartService, productService, ticketService } = require("../service/index");
const { cartModel } = require("../models/cart.model");

class CartsController {
  createCart = async (req, res) => {
    try {
      const { productId, quantity, cartId } = req.body;
      let cart = await cartModel.findById(cartId);
      if (!cart) {
        cart = await cartModel.create({});
      }
      const existingProduct = cart.products.find(
        (product) => product.product.toString() === productId
      );
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
  };

  getCart = async (req, res) => {
    try {
      const cart = await cartService.getById(req.params.cid);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      res.json({ status: "success", payload: cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  addProductToCart = async (req, res) => {
    try {
      const cart = await cartService.getById(req.params.cid);
      const product = await productService.getById(req.params.pid);
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
  };

  updateCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartService.getById(cartId);
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      const { products } = req.body;
      if (!Array.isArray(products))
        return res.status(400).json({ error: "Invalid products array" });
      cart.products = products;
      const updatedCart = await cartService.saveCart(cart);
      res.json({ status: "success", payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateProductInCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const cart = await cartService.getById(cartId);
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      const productIndex = cart.products.findIndex(
        (p) => p.id.toString() === productId
      );
      if (productIndex === -1)
        return res.status(404).json({ error: "Product not found in Cart" });
      const newQuantity = parseInt(req.body.quantity);
      if (isNaN(newQuantity))
        return res.status(400).json({ error: "Invalid quantity value" });
      cart.products[productIndex].quantity = newQuantity;
      const updatedCart = await cartService.save(cart);
      res.json({ status: "success", payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartService.getById(cartId);
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      cart.products = [];
      const updatedCart = await cartService.save(cart);
      res.json({ status: "success", payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteProductInCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const cart = await cartService.getById(cartId);
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      const productIndex = cart.products.findIndex((p) => p.id.toString() === productId);
      if (productIndex === -1) return res.status(404).json({ error: "Product not found in Cart" });
      cart.products.splice(productIndex, 1);
      const updatedCart = await cartService.save(cart);
      res.json({ status: "success", payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  generateTicket = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.getById(cid);
      if (!cart) return res.status(404).json({ error: "Cart not found" });

      const productNotPurchased = [];
      const shoppableProducts = [];

      for (const item of cart.products) {
        const productId = item.product;
        const objProduct = await productService.getById(productId);
        const quantity = item.quantity;
        const stock = objProduct.stock;
        const price = objProduct.price;
        if (quantity > stock) {
          productNotPurchased.push(productId);
        } else {
          const response = await productService.update(productId, { stock: stock - quantity });
          shoppableProducts.push({
            product: productId,
            quantity,
            stock,
            price,
          });
        }
      }
    
      if (productNotPurchased.length > 0) {
        cart.products = cart.products.filter((item) => productNotPurchased.includes(item.product));
        await cartService.save(cart);
        return res.json({ productNotPurchased })
      } else {
        await cartService.delete(cid)
      }

      const totalAmount = shoppableProducts.reduce((acc, product) => {
        const price = parseFloat(product.price);
        const quantity = parseFloat(product.quantity);
        const productAmount = price * quantity;
        return acc + productAmount;
      }, 0);

      const ticket = await ticketService.create({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: "usuario@dominio.com",
      });

      res.json({
        status: "success",
        payload: {
          ticket: ticket,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new CartsController();
