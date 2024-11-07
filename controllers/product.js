const mongoose = require("mongoose");

const asyncHandler = require("../utilities/asyncHandler");
const ErrorResponse = require("../utilities/errorResponse");

const Product = require("../models/product");

// @desc    Fetch all products, with pagination, search keyword and filtering
// @route   GET /api/products
// @access  Public
module.exports.getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT || 12;
  const page = Number(req.query.page) || 1;

  const query = {};

  //search keyword
  //keyword=[Somthing]

  if (req.query.keyword) {
    query.name = { $regex: req.query.keyword, $options: "i" };
  }

  // filter by brand
  //brand=[Somthing]
  if (req.query.brands) {
    query.brand = { $in: req.query.brands.split(",") };
  }

  // filter  by category
  //category=[Somthing]

  if (req.query.category) {
    query.categories = { $in: [req.query.category] };
  }

  //filter by available in stock
  //in_stock=true
  if (req.query.in_stock && req.query.in_stock === "true") {
    query.countInStock = { $gt: 0 };
  }

  // filter  by rating
  // rating=$gte:3

  if (req.query.rating) {
    query.rating = { $gte: Number(req.query.rating.split(":")[1]) };
  }

  // filter by price min max price
  if (req.query.min_price || req.query.max_price) {
    query.price = {};
    // min_price=[min_price]
    if (req.query.min_price) query.price.$gte = Number(req.query.min_price);
    // max_price=[max_price]
    if (req.query.max_price) query.price.$lte = Number(req.query.max_price);
  }

  //sorting
  let sort = { createdAt: -1 };

  if (req.query.sort && (req.query.order === "asc" || req.query.order === "desc")) {
    sort = { [req.query.sort]: req.query.order === "desc" ? -1 : 1 };
  }

  const count = await Product.countDocuments(query);

  const products = await Product.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort(sort);

  const pages = Math.ceil(count / pageSize);

  res.status(200).send({ products, page, pages });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
module.exports.getSingleProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ErrorResponse("Product not found", 404);
  }

  const product = await Product.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .populate({
      path: "categories",
      select: "name",
    });

  if (!product) {
    throw new ErrorResponse("Product not found", 404);
  }

  res.status(200).json(product);
});

// @desc    Get top rated products
// @route   GET /api/top/products/
// @access  Public
module.exports.getTopProducts = asyncHandler(async (req, res) => {
  const size = Number(req.query.size) || 5;

  const products = await Product.find({}).sort({ rating: -1 }).limit(size);

  res.status(200).json(products);
});

// @desc    Get reviews by id
// @route   GET /api/products/:id/reviews
// @access  Public
module.exports.getReviews = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ErrorResponse("Product not found", 404);
  }

  const product = await Product.findById(req.params.id)
    .select("reviews")
    .populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name email",
      },
    });

  if (!product) {
    throw new ErrorResponse("Product not found", 404);
  }

  res.status(200).send(product.reviews);
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
module.exports.createReview = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ErrorResponse("Product not found", 404);
  }

  const { rating, comment } = req.body;

  let errors = {};

  if (!rating) {
    errors.rating = "Rating field is required";
  }
  if (!comment) {
    errors.comment = "Comment field is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ErrorResponse("Please fill in missing fields", 400, { errors });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ErrorResponse("Product not found", 404);
  }

  const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());

  if (alreadyReviewed) {
    throw new ErrorResponse("Product already reviewed", 409);
  }

  const newReview = {
    user: req.user._id,
    comment,
    rating: Number(rating),
  };

  product.reviews.push(newReview);

  product.numReviews = product.reviews.length;

  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save();

  res.status(201).send({ product, newReview, message: "Review added" });
});

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private/Admin
module.exports.createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, categories, countInStock } = req.body;

  // VALIDATION
  let errors = {};

  if (!name) {
    errors.name = "Name field is required";
  }
  if (!price) {
    errors.price = "Price field is required";
  }
  if (!description) {
    errors.description = "Description field is required";
  }
  if (!image) {
    errors.image = "Image field is required";
  }
  if (!brand) {
    errors.brand = "Brand field is required";
  }
  if (!categories || (Array.isArray(categories) && categories.length < 1)) {
    errors.categories = "Categories field is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ErrorResponse("Product validation failed", 400, { errors });
  }

  const newProduct = await Product.create({
    user: req.user._id,
    name,
    price,
    description,
    image,
    brand,
    countInStock: countInStock || 0,
    categories: Array.isArray(categories) ? [...new Set(categories)] : [categories],
    numReviews: 0,
  });

  res.status(201).json(newProduct);
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
module.exports.deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ErrorResponse("Product not found", 404);
  }

  const deletedProduct = await Product.findByIdAndRemove(req.params.id);

  if (!deletedProduct) {
    throw new ErrorResponse("Product not found", 404);
  }

  res.status(202).send({ deletedProduct, message: "Product removed" });
});

// @desc    Update a product
// @route   PATCH /api/admin/products/:id
// @access  Private/Admin
module.exports.updateProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ErrorResponse("Product not found", 404);
  }

  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "price", "description", "image", "brand", "categories", "countInStock"];

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new ErrorResponse("Invalid updates", 400);
  }

  let errors = {};
  updates.forEach((update) => {
    if (!["categories", "countInStock"].includes(update) && !req.body[update]) {
      errors[update] = `${update.charAt(0).toUpperCase() + update.slice(1)} field is required`;
      console.log(update);
    }

    if (update === "categories" && (!req.body[update] || (Array.isArray(req.body[update]) && req.body[update].length < 1))) {
      errors.categories = "Categories field is required";
    }
  });

  if (Object.keys(errors).length > 0) {
    throw new ErrorResponse("Product validation failed", 400, { errors });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ErrorResponse("Product not found", 404);
  }

  updates.forEach((update) => {
    if (update === "categories") {
      if (Array.isArray(req.body[update])) {
        product[update] = [...new Set([...req.body[update]])];
      } else {
        product[update] = [req.body[update]];
      }
    } else {
      product[update] = req.body[update];
    }
  });

  const updatedProduct = await product.save();

  res.status(202).send({ updatedProduct, message: "Product updated" });
});
