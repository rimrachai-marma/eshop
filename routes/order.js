const express = require("express");

const { admin, auth } = require("../middleware/auth");
const orderControllers = require("../controllers/order");

const router = new express.Router();

router.post("/orders/create/paypal", auth, orderControllers.createOrder);
router.post("/orders/capture/paypal", auth, orderControllers.captureOrder);
router.get("/orders/:id", auth, orderControllers.getUserOrder);
router.get("/orders", auth, orderControllers.getUserOrderList);
router.get("/admin/orders", auth, admin, orderControllers.getOrderList);
router.patch("/admin/orders/:id/status/:status", auth, admin, orderControllers.updateOrderStatus);

module.exports = router;
