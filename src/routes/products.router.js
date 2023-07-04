const { Router } = require("express");
const productsController = require("../controllers/products.controller");
const { passportAuth } = require('../passport-jwt/passportAuth')
const { authorization } = require('../passport-jwt/passportAuthorization')

const router = Router();

router.get("/", passportAuth("jwt"), productsController.getProducts);
router.post("/", passportAuth("jwt"), authorization("admin"), productsController.createProduct);
router.get("/:pid", passportAuth("jwt"), productsController.getProductById);
router.put("/:pid", passportAuth("jwt"), authorization("admin"), productsController.updateProduct);
router.delete("/:pid", passportAuth("jwt"), authorization("admin"), productsController.deleteProduct);

module.exports = router;
