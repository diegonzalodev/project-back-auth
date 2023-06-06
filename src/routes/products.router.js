const { Router } = require("express");
const productManager = require("../dao/mongodb/ProductManagerMongo");

const router = Router();

router.get("/", async (req, res) => {
  try {
    let { limit, page, sort, query } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    sort = sort || "";
    query = query || "";
    const filter = {};
    if (query) {
      filter.category = query;
    }
    const products = await productManager.getProducts(filter);
    if (sort === "asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      products.sort((a, b) => b.price - a.price);
    }
    const totalPages = Math.ceil(products.length / limit);
    page = Math.max(1, Math.min(page, totalPages));
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    const prevLink =
      page > 1
        ? `/api/products?limit=${limit}&page=${
            page - 1
          }&sort=${sort}&query=${query}`
        : null;
    const nextLink =
      page < totalPages
        ? `/api/products?limit=${limit}&page=${
            page + 1
          }&sort=${sort}&query=${query}`
        : null;
    const response = {
      status: "success",
      payload: paginatedProducts,
      totalPages,
      prevPage: page - 1,
      nextPage: page + 1,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink,
      nextLink,
    };
    res.send({ status: "success", payload: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const addedProduct = await productManager.addProduct(req.body);
    res.send(addedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const findByID = products.find((prod) => prod.id === req.params.pid);
    if (!findByID) return res.send({ error: "This product doesn't exist" });
    res.send(findByID);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(
      req.params.pid,
      req.body
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await productManager.deleteProduct(req.params.pid);
    res.send(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
