const { Router } = require("express");
const cartsController = require("../controllers/carts.controller");

const router = Router();

router.post("/", cartsController.createCart);
router.get("/:cid", cartsController.getCart);
router.post("/:cid/purchase", cartsController.generateTicket);
router.post("/:cid/product/:pid", cartsController.addProductToCart);
router.put("/:cid", cartsController.updateCart);
router.put("/:cid/products/:pid", cartsController.updateProductInCart);
router.delete("/:cid", cartsController.deleteCart);
router.delete("/:cid/product/:pid", cartsController.deleteProductInCart);

module.exports = router;
