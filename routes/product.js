const express = require("express");

const { auth, admin } = require("../middleware/auth");

const productControllers = require("../controllers/product");

const router = new express.Router();

router.get("/products", productControllers.getProducts);

router.get("/products/:id", productControllers.getSingleProduct);

router.get("/top/products", productControllers.getTopProducts);

router
  .route("/products/:id/reviews")
  .get(productControllers.getReviews)
  .post(auth, productControllers.createReview); // Private Routes

router.post("/admin/products", auth, admin, productControllers.createProduct); // Private & Admin Routes

router
  .route("/admin/products/:id")
  .delete(auth, admin, productControllers.deleteProduct) // Private & Admin Routes
  .patch(auth, admin, productControllers.updateProduct); // Private & Admin Routes

module.exports = router;
