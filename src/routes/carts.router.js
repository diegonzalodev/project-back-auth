const { Router } = require("express");
const cartsController = require("../controllers/carts.controller");

const router = Router();

router.post("/", cartsController.createCart );
router.get("/:cid", cartsController.getCart);
router.post("/:cid/product/:pid", cartsController.addProducttoCart);
router.put("/:cid", cartsController.updateCart);
router.put("/:cid/products/:pid", cartsController.updateProductinCart);
router.delete("/:cid", cartsController.deleteCart);
router.delete("/:cid/product/:pid", cartsController.deleteProductinCart);

module.exports = router;
