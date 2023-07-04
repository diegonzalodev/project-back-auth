const { Router } = require("express");
const cartsController = require("../controllers/carts.controller");
const { passportAuth } = require('../passport-jwt/passportAuth')

const router = Router();

router.post("/", passportAuth("jwt"), cartsController.createCart);
router.get("/:cid", passportAuth("jwt"), cartsController.getCart);
router.post("/:cid/purchase", passportAuth("jwt"), cartsController.generateTicket);
router.post("/:cid/product/:pid", passportAuth("jwt"), cartsController.addProductToCart);
router.put("/:cid", passportAuth("jwt"), cartsController.updateCart);
router.put("/:cid/product/:pid", passportAuth("jwt"), cartsController.updateProductInCart);
router.delete("/:cid", passportAuth("jwt"), cartsController.deleteCart);
router.delete("/:cid/product/:pid", passportAuth("jwt"), cartsController.deleteProductInCart);

module.exports = router;
