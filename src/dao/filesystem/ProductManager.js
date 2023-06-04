const fs = require("fs");
const path = require("path");

class ProductManagerFile {
  constructor() {
    this.path = path.join(__dirname, "../products.json");
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

  addProduct = async (newProduct) => {
    try {
      if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.code ||
        !newProduct.price ||
        !newProduct.stock ||
        !newProduct.category
      )
        return { error: "All fields are required" };

      let products = await this.readFile();
      let verifyProduct = products.find((prod) => prod.code === newProduct.code);
      if (verifyProduct) return { error: "A product with this code already exists" };
      let id = products.length ? products[products.length - 1].id + 1 : 1;
      let status = newProduct.status === (undefined || " ") ? true : newProduct.status;
      let thumbnail = newProduct.thumbnail || [];
      const product = { id, ...newProduct, status, thumbnail };
      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
      return {success: "Product added", payload: product};
    } catch (error) {
      return new Error(error);
    }
  };

  getProducts = async () => {
    try {
      return await this.readFile();
    } catch (error) {
      return new Error(error);
    }
  };

  getProductById = async (id) => {
    try {
      const products = await this.readFile();
      return products.find((prod) => prod.id === id);
    } catch (error) {
      return new Error(error);
    }
  };

  updateProduct = async (id, updatedProduct) => {
    try {
      let products = await this.readFile();
      const productToUpdate = products.find((prod) => prod.id === id);
      if (!productToUpdate) return {error: "There is no product with this ID"};
      Object.assign(productToUpdate, updatedProduct)
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
      return {success: `Product with ID ${id} updated`};
    } catch (error) {
      return new Error(error);
    }
  };

  deleteProduct = async (id) => {
    try {
      let products = await this.readFile();
      const filteredProducts = products.filter((prod) => prod.id !== id);
      if (filteredProducts.length === products.length) return { error: "Incorrect ID"};
      await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2), "utf-8");
      return {success: `Product with ID ${id} deleted`};
    } catch (error) {
      return new Error(error);
    }
  };
}

module.exports = { ProductManagerFile };
