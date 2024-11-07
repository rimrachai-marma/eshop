const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");

const User = require("../models/user");
const asyncHandler = require("../utilities/asyncHandler");
const ErrorResponse = require("../utilities/errorResponse");
const { isStrongPassword, isEmail } = require("../utilities/validator");

//@desc   register users
//@route  POST /api/users/register
//@access Public route
module.exports.userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // VALIDATION
  let errors = {};

  if (!name) {
    errors.name = "Name field is required";
  }
  if (!email) {
    errors.email = "Email field is required";
  }
  if (!password) {
    errors.password = "Password field is required";
  }
  if (email && !isEmail(email)) {
    errors.email = "Your entered email is not valid";
  }
  if (password && !isStrongPassword(password)) {
    errors.password = "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no spaces.";
  }
  if (password && password.length < 8) {
    errors.password = "Password is too short. Minimum length is 8 characters";
  }
  if (password && password.length > 16) {
    errors.password = "Password is too long. Maximum length is 16 characters";
  }

  if (Object.keys(errors).length > 0) {
    throw new ErrorResponse("User validation failed", 400, { errors });
  }

  // IF VALIDATION PASS CHECK EXISTING USER

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ErrorResponse("User already exists", 409);
  }

  const newUser = await User.create({ name, email, password });

  const token = await newUser.generateAuthToken();

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(201).send({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  });
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
module.exports.userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // VALIDATION
  let errors = {};

  if (!email) {
    errors.email = "Email field is required";
  }
  if (!password) {
    errors.password = "Password field is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ErrorResponse("Please fill in missing fields", 400, { errors });
  }

  const user = await User.findByCredentials(email, password);

  const token = await user.generateAuthToken();

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(200).send({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

// @desc    User logout
// @route   POST /api/users/logout
// @access  Private
module.exports.userLogout = asyncHandler(async (req, res) => {
  req.user.tokens = req.user.tokens.filter((token) => token !== req.token);
  await req.user.save();

  res.cookie("auth_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(202).send({ message: "Successfuly logout" });
});

// @desc    User logout all divice
// @route   POST /api/users/logout-all-devices
// @access  Private
module.exports.logoutAllDevices = asyncHandler(async (req, res) => {
  req.user.tokens = [];
  await req.user.save();

  res.cookie("auth_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(202).send({ message: "Successfuly logout" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
module.exports.getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).send({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar,
  });
});

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
module.exports.deleteUserProfile = asyncHandler(async (req, res) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  const deletedUser = await req.user.deleteOne();
  // Send Cancelation Email

  res.status(202).send({ deletedUser, message: "User delete Successfuly" });
});

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
module.exports.updateUserProfile = asyncHandler(async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "email"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new ErrorResponse("Invalid updates", 400);
  }

  let errors = {};
  updates.forEach((update) => {
    if (!req.body[update]) {
      errors[update] = `${update.charAt(0).toUpperCase() + update.slice(1)} field is required`;
    }

    if (update === "email" && req.body[update] && !isEmail(req.body[update])) {
      errors.email = "Your entered email is not valid";
    }
  });

  if (Object.keys(errors).length > 0) {
    throw new ErrorResponse("User validation failed", 400, { errors });
  }

  updates.forEach((update) => {
    req.user[update] = req.body[update];
  });

  const updatedUser = await req.user.save();
  res.status(202).send({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

// @desc    Update password change
// @route   PATCH /api/users/changepassword
// @access  Private
module.exports.changeUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmedPassword } = req.body;

  // VALIDATION
  let errors = {};

  if (!currentPassword) {
    errors.currentPassword = "Current password field is required";
  }
  if (!newPassword) {
    errors.newPassword = "New password field is required";
  }
  if (!confirmedPassword) {
    errors.confirmedPassword = "Confirm password field is required";
  }

  if (currentPassword) {
    const isMatch = await bcrypt.compare(currentPassword, req.user.password);

    if (!isMatch) {
      errors.currentPassword = "Invalid current password";
    }
  }

  if (newPassword && !isStrongPassword(newPassword)) {
    errors.newPassword =
      "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no spaces.";
  }
  if (newPassword && newPassword.length < 8) {
    errors.newPassword = "Password is too short. Minimum length is 8 characters";
  }
  if (newPassword && newPassword.length > 16) {
    errors.newPassword = "Password is too long. Maximum length is 16 characters";
  }

  if (confirmedPassword && newPassword && isStrongPassword(newPassword) && newPassword !== confirmedPassword) {
    errors.confirmedPassword = "Confirm password does not match";
  }

  if (Object.keys(errors).length > 0) {
    throw new ErrorResponse("User validation failed", 400, { errors });
  }

  req.user.password = newPassword;

  await req.user.save();

  res.status(202).send({ message: "Succesfully changed password" });
});

// @desc    Upload user avatar image
// @route   POST /users/profile/avatar
// @access  Private
module.exports.uploadUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ErrorResponse("Please select a profile image", 400);
  }

  const buffer = await sharp(req.file.buffer).resize({ width: 160, height: 160 }).png().toBuffer();

  req.user.avatar = buffer;
  await req.user.save();

  res.status(200).send({ message: "Succesfully uploaded avatar image." });
});

// @desc    Delete user avatar image
// @route   DELETE /users/profile/avatar
// @access  Private
module.exports.deleteUserAvatar = asyncHandler(async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(202).send({ message: "Succesfully deleted Avatar image." });
});

// @desc    get user avatar image
// @route   get /users/:id/avatar
// @access  Public
module.exports.getUserAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  if (user && !user.avatar) {
    res.status(204).send("No profile image found");
  }

  res.set("Content-Type", "image/png");
  res.status(200).send(user.avatar);
});

/*---ADMIN CONTROLLERS ---*/

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
module.exports.getAllUsers = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;

  const query = {};

  if (req.query.email) {
    query.email = req.query.email;
  }

  if (req.query.keyword) {
    query.name = { $regex: req.query.keyword, $options: "i" };
  }

  if (req.query.role && req.query.role === "customer") {
    query.role = "customer";
  }
  if (req.query.role && req.query.role === "admin") {
    query.role = "admin";
  }
  if (req.query.role && req.query.role === "superadmin") {
    query.role = "superadmin";
  }

  const count = await User.countDocuments(query);

  const users = await User.find(query)
    .select("-password -tokens -avatar")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const pages = Math.ceil(count / pageSize);

  res.status(200).send({ users, page, pages });
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
module.exports.getUser = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ErrorResponse("User not found", 404);
  }

  const user = await User.findById(req.params.id).select("-password -tokens -avatar");

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  res.status(200).send(user);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin & SuperAdmin
module.exports.deleteUser = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ErrorResponse("User not found", 404);
  }

  const user = await User.findById(req.params.id).select("name email  role");

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  if (req.user.role !== "superadmin" && user.role !== "customer") {
    // admin to admin delete not allowed
    throw new ErrorResponse("Access denied, not allowed", 403);
  }

  const deletedUser = await user.deleteOne();

  res.status(202).send({ deletedUser, message: "User removed" });
});

// @desc    Update user
// @route   PATCH /api/superadmin/users/:id
// @access  Private/SuperAdmin
module.exports.updateUser = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ErrorResponse("User not found", 404);
  }

  const updates = Object.keys(req.body);

  const allowedUpdates = ["role"];

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new ErrorResponse("Invalid updates", 404);
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  updates.forEach((update) => (user[update] = req.body[update]));
  const updatedUser = await user.save();

  res.status(202).send({
    updatedUser: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      gender: updatedUser.gender,
    },

    message: "User updated",
  });
});
