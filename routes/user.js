const express = require("express");

const userControllers = require("../controllers/user");
const ErrorResponse = require("../utilities/errorResponse");
const { bufferImageUpload } = require("../middleware/multer");
const { auth, admin, superadmin } = require("../middleware/auth");

const router = new express.Router();

router.post("/users/register", userControllers.userRegister);

router.post("/users/login", userControllers.userLogin);

router.post("/users/logout", auth, userControllers.userLogout); // Private route

router.post("/users/logout-all-devices", auth, userControllers.logoutAllDevices); // Private route

router.patch("/users/change-password", auth, userControllers.changeUserPassword); // Privite route

router
  .route("/users/profile")
  .get(auth, userControllers.getUserProfile) // Private route
  .delete(auth, userControllers.deleteUserProfile) // Private route
  .patch(auth, userControllers.updateUserProfile); // Private route

router
  .route("/users/profile/avatar")
  .post(auth, bufferImageUpload.single("avatar"), userControllers.uploadUserAvatar, (err, req, res, next) => {
    throw new ErrorResponse(err.message, 400);
  }) // Private route
  .delete(auth, userControllers.deleteUserAvatar); // Private route

router.get("/users/:id/avatar", userControllers.getUserAvatar);

router.get("/admin/users", auth, admin, userControllers.getAllUsers); // Private & Admin and also superadmin Routes | admin to admin delete not alowed

router
  .route("/admin/users/:id")
  .get(auth, admin, userControllers.getUser) // Private & Admin and also superadmin Routes
  .delete(auth, admin, userControllers.deleteUser); // Private & Admin and also superadmin Routes

router.patch("/superadmin/users/:id", auth, superadmin, userControllers.updateUser); // Private & Only SuperAdmin Routes

module.exports = router;
