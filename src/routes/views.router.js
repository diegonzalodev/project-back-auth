const { Router } = require("express");
const url = require("url");
const productManager = require("../dao/mongodb/ProductManagerMongo");
const { productModel } = require("../dao/mongodb/models/product.model.js");
const cartManager = require("../dao/mongodb/CartManagerMongo");
const { messageModel } = require("../dao/mongodb/models/message.model.js");

const router = Router();

router.get("/", (req, res) => {
  res.render("login", {});
});

router.get("/register", (req, res) => {
  res.render("register", {});
});

router.get("/products", async (req, res) => {
  try {
    const user = req.session.user;
    let { limit, page, sort, query } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    sort = sort === "asc" ? "price" : sort === "desc" ? "-price" : "";
    query = query || {};
    const options = {
      limit,
      page,
      sort,
      query,
    };
    const result = await productManager.getPaginatedProducts(options);
    const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } =
      result;
    if (page > totalPages) throw new Error("Page not found");
    const currentUrl = url.parse(req.url, true);
    delete currentUrl.search;
    const paginationLinks = {
      prevPage: prevPage
        ? url.format({
            ...currentUrl,
            query: { ...currentUrl.query, page: prevPage },
          })
        : null,
      nextPage: nextPage
        ? url.format({
            ...currentUrl,
            query: { ...currentUrl.query, page: nextPage },
          })
        : null,
    };
    const products = Array.isArray(docs)
      ? docs.map((product) => product.toObject())
      : [];
    res.render("products", {
      products,
      totalPages,
      ...paginationLinks,
      page,
      hasPrevPage,
      hasNextPage,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.send({ error: "There is no cart with this ID" });
    res.render("cart", { cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const data = await productModel.find().lean();
    res.render("realTimeProducts", { products: data });
  } catch (error) {
    console.error(error);
    res.render("realTimeProducts", { products: [] });
  }
});

router.get("/chat", async (req, res) => {
  try {
    const messages = await messageModel.find().lean();
    res.render("chat", { messages });
  } catch (error) {
    console.error("Error fetching messages from DB:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
