const express = require("express");

const { admin, auth } = require("../middleware/auth");
const categoryControllers = require("../controllers/category");

const router = new express.Router();

router.get("/parent-categories", categoryControllers.getParentCategories);
router.get("/categories", categoryControllers.getAllCategories);
router.get("/category-tree", categoryControllers.getCategoryTree);
router.get("/categories/:id", categoryControllers.getCategory);
router.get("/categories/:category/brands", categoryControllers.getCategoryBrands);
router.get("/categories-brands", categoryControllers.getAllCategoriesBrands);

router.post("/admin/categories", auth, admin, categoryControllers.createCategory); //ADMIN
router
  .route("/admin/categories/:id") //ADMIN
  .patch(auth, admin, categoryControllers.updateCategory) //ADMIN
  .delete(auth, admin, categoryControllers.deleteCategory); //ADMIN

module.exports = router;
