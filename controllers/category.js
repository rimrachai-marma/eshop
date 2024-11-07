const mongoose = require("mongoose");

const asyncHandler = require("../utilities/asyncHandler");
const ErrorResponse = require("../utilities/errorResponse");
const Category = require("../models/category");

// @desc    GET ALL CATEGORIES
// @route   GET /api/categories?parent_category=657c1e421fe57a36e453e940
// @access  public
module.exports.getAllCategories = asyncHandler(async (req, res) => {
  const query = {};

  if (req.query.parent_category) {
    query.parentCategory = req.query.parent_category;
  }

  const categories = await Category.find(query).populate({
    path: "parentCategory",
    select: "name",
  });

  res.status(200).json(categories);
});

// @desc    GET ALL CATEGORIES BRANDS
// @route   GET /api/categories-brands
// @access  public
module.exports.getAllCategoriesBrands = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  const brands = [...new Set(categories.flatMap((category) => category.brands))];

  res.status(200).json(brands);
});

// @desc    GET PARENT CATEGORIES
// @route   GET /api/parent-categories
// @access  public
module.exports.getParentCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    parentCategory: { $exists: false, $eq: null },
  });

  res.status(200).json(categories);
});

// @desc    GET CATEGORY By ID
// @route   GET /api/categories/:id
// @access  public
module.exports.getCategory = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ErrorResponse("Category not found", 404);
  }

  const category = await Category.findById(req.params.id).populate({
    path: "parentCategory",
    select: "name",
  });

  if (!category) {
    throw new ErrorResponse("Category not found", 404);
  }

  res.status(200).json(category);
});

// @desc    GET CATEGORY BRANDS
// @route   GET /api/categories/:category/brands
// @access  public
module.exports.getCategoryBrands = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ name: req.params.category });

  if (!category) {
    throw new ErrorResponse("Category not found", 404);
  }

  res.status(200).json(category.brands);
});

// @desc    GET CATEGORY TREE
// @route   GET /api/category-tree
// @access  public
module.exports.getCategoryTree = asyncHandler(async (req, res) => {
  function buildCategoryTree(categories) {
    const categoryMap = {};
    const categoryTree = [];

    categories.forEach((category) => {
      categoryMap[category._id] = { ...category.toJSON(), child: [] };
    });

    categories.forEach((category) => {
      if (!category.parentCategory) {
        categoryTree.push(categoryMap[category._id]);
      } else {
        categoryMap[category.parentCategory].child.push(categoryMap[category._id]);
      }
    });

    return categoryTree;
  }

  const categories = await Category.find({});
  const categoryTree = buildCategoryTree(categories);

  res.status(200).json(categoryTree);
});

// @desc    CREATE CATEGORY
// @route   POST /api/admin/categories
// @access  private adimin
module.exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory, brands } = req.body;

  let errors = {};

  if (!name) {
    errors.name = "Name field is required";
  }
  if (Object.keys(errors).length > 0) {
    throw new ErrorResponse("Category validation failed", 400, { errors });
  }

  const modifiedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const categoryExists = await Category.findOne({ name: modifiedName });

  if (categoryExists) {
    throw new ErrorResponse("Category already exists", 409);
  }

  const createdCategory = await Category.create({
    name: modifiedName,
    description,
    parentCategory,
    brands: Array.isArray(brands) ? [...new Set(brands)] : [brands],
  });
  res.status(201).json(createdCategory);
});

// @desc    UPDATE CATEGORY
// @route   PATCH /api/admin/categories/:id
// @access  private adimin
module.exports.updateCategory = asyncHandler(async (req, res) => {
  if (req.body.parentCategory === "") req.body.parentCategory = undefined;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ErrorResponse("Category not found", 404);
  }

  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "description", "parentCategory", "brands"];

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new ErrorResponse("Invalid updates", 400);
  }

  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ErrorResponse("Category not found", 404);
  }

  updates.forEach((update) => {
    if (update === "brands") {
      if (Array.isArray(req.body[update])) {
        category[update] = [...new Set([...req.body[update]])];
      } else {
        category[update] = [req.body[update]];
      }
    } else {
      category[update] = req.body[update];
    }
  });

  const updatedCategory = await category.save();

  res.status(200).send({ updatedCategory, message: "Category updated" });
});

// @desc    DELETE CATEGORY
// @route   DELETE /api/admin/categories/:id
// @access  private adimin
module.exports.deleteCategory = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ErrorResponse("Category not found", 404);
  }

  const deletedCategory = await Category.findByIdAndRemove(req.params.id);

  if (!deletedCategory) {
    throw new ErrorResponse("Category not found", 404);
  }

  res.status(202).send({ deletedCategory, message: "Category removed" });
});
