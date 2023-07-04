const { Router } = require("express");
const viewsRouter = require("./views.router");
const productsRouter = require("./products.router");
const cartsRouter = require("./carts.router");
const sessionRouter = require("./session.router");
const sendRouter = require("./send.router");

const router = Router();

router.use("/", viewsRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/session", sessionRouter);
router.use("/api/send", sendRouter);

module.exports = router;
