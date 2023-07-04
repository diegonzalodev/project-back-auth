const { Router } = require("express");
const productsController = require("../controllers/products.controller");

const router = Router();

router.get("/", productsController.getProducts);
router.post("/", productsController.createProduct);
router.get("/:pid", productsController.getProductById);
router.put("/:pid", productsController.updateProduct);
router.delete("/:pid", productsController.deleteProduct);

module.exports = router;
