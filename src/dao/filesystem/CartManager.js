const fs = require("fs");
const path = require("path");

class CartManagerFile {
  constructor() {
    this.path = path.join(__dirname, "../carts.json");
    this.init();
  }

  init = () => {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  };

  readFile = async () => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  };

  createCart = async () => {
    try {
      const carts = await this.readFile();
      const newCartId = carts.length > 0 ? Math.max(...carts.map((cart) => cart.id)) + 1 : 1;
      const newCart = { id: newCartId, products: [] };
      carts.push(newCart);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );
      return newCart;
    } catch (error) {
      return new Error(error);
    }
  };

  getCardById = async (id) => {
    try {
      const carts = await this.readFile();
      const findCart = carts.find((cart) => cart.id === id);
      return findCart;
    } catch (error) {
      return new Error(error);
    }
  };

  getProductsOfCart = async (id) => {
    try {
      const cart = await this.getCardById(id);
      return cart ? cart.products : null;
    } catch (error) {
      return new Error(error);
    }
  };

  saveCart = async (cart = this) => {
    try {
      const carts = await this.readFile();
      const updatedCarts = carts.map((c) => (c.id === cart.id ? cart : c))
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(updatedCarts, null, 2),
        "utf-8"
      );
    } catch (error) {
      return new Error(error);
    }
  };
}

module.exports = { CartManagerFile };
