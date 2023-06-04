const { Router } = require("express");
const viewsRouter = require("./views.router");
const productsRouter = require("./products.router");
const cartsRouter = require("./carts.router");
const sessionRouter = require("./session.router");

const router = Router();

router.use("/", viewsRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/session", sessionRouter);

module.exports = router;
