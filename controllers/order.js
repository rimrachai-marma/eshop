const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");
const { round } = require("../utilities/formaters");
const asyncHandler = require("../utilities/asyncHandler");
const ErrorResponse = require("../utilities/errorResponse");
const {
  create_order,
  capture_order,
  get_order_details,
} = require("../services/paypal");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
module.exports.createOrder = asyncHandler(async (req, res) => {
  const taxRate = process.env.TAX_RATE || 10;
  const shippingPrice = 50; // it should be based on location

  const { orderItems, shippingAddress } = req.body;

  let errors = {};
  if (!orderItems) {
    errors.orderItems = "Order items is required";
  }
  if (!shippingAddress) {
    errors.shippingAddress = "Shipping address is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ErrorResponse("Please fill in missing fields", 400, { errors });
  }

  if (orderItems && !orderItems.length > 0) {
    throw new ErrorResponse("No order items", 400);
  }

  function calculateTax(price, taxRate) {
    return price * (taxRate / 100);
  }

  const order_items = await Promise.all(
    orderItems.map(async (orderItem) => {
      const storeItem = await Product.findById(orderItem.id);

      return {
        productId: orderItem.id,
        quantity: orderItem.quantity,
        name: storeItem.name,
        image: storeItem.image,
        price: storeItem.price,
      };
    })
  );

  const itemsPrice = round(
    order_items.reduce((total, orderItem) => {
      return orderItem.price * orderItem.quantity + total;
    }, 0),
    2
  );

  const totalTax = round(
    order_items.reduce((total, item) => {
      return total + calculateTax(item.price * item.quantity, taxRate);
    }, 0),
    2
  );

  const grandTotal = round(itemsPrice + totalTax + shippingPrice, 2);

  const schema = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: grandTotal,

          breakdown: {
            item_total: {
              currency_code: "USD",
              value: itemsPrice,
            },
            shipping: {
              currency_code: "USD",
              value: shippingPrice,
            },
            tax_total: {
              currency_code: "USD",
              value: totalTax,
            },
          },
        },

        items: order_items.map((item) => {
          return {
            sku: item.productId,
            name: item.name,
            unit_amount: {
              currency_code: "USD",
              value: round(item.price, 2),
            },
            quantity: item.quantity,
          };
        }),

        shipping: {
          name: {
            full_name: req.user.name,
          },
          address: {
            address_line_1: shippingAddress.addressLine1,
            address_line_2: shippingAddress?.addressLine2 ?? "",
            admin_area_2: shippingAddress.city,
            admin_area_1: shippingAddress.state,
            postal_code: shippingAddress.postalCode,
            country_code: shippingAddress.countryCode,
          },
        },
      },
    ],
  };

  res.send(await create_order(schema));
});

module.exports.captureOrder = asyncHandler(async (req, res) => {
  const orderID = req.body.orderID;

  let errors = {};
  if (!orderID) {
    errors.orderID = "Order ID is required";
  }

  if (Object.keys(errors).length > 0) {
    throw new ErrorResponse("Please fill in missing fields", 400, { errors });
  }

  // capture order and get order detailes
  const order = await capture_order(orderID);
  const orderDetails = await get_order_details(order.id);

  // for save to database
  const order_items = orderDetails.purchase_units[0].items;
  const orderAmount = orderDetails.purchase_units[0].amount;
  const shipping = orderDetails.purchase_units[0].shipping;
  const payer = orderDetails.payer;

  const orderItems = await Promise.all(
    order_items.map(async (orderItem) => {
      const storeItem = await Product.findById(orderItem.sku);

      return {
        sku: orderItem.sku,
        quantity: Number(orderItem.quantity),
        name: orderItem.name,
        image: storeItem.image,
        price: Number(orderItem.unit_amount.value),
      };
    })
  );

  // save to database
  const newOrder = await Order.create({
    orderId: orderDetails.id,
    user: req.user._id,
    orderItems,
    shipping: {
      name: shipping.name.full_name,
      address: {
        addressLine1: shipping.address.address_line_1,
        addressLine2: shipping.address?.address_line_2 ?? "",
        city: shipping.address.admin_area_2,
        state: shipping.address.admin_area_1,
        postalCode: shipping.address.postal_code,
        countryCode: shipping.address.country_code,
      },
    },
    paymentMethod: "Paypal",
    paymentResult: {
      status: orderDetails.status,
      update_time: orderDetails.update_time,
      payer_name: `${payer.name.given_name} ${payer.name.surname}`,
      payer_id: payer.payer_id,
      payer_email_address: payer.email_address,
    },
    itemsPrice: Number(orderAmount.breakdown.item_total.value),
    totalTax: Number(orderAmount.breakdown.tax_total.value),
    shippingPrice: Number(orderAmount.breakdown.shipping.value),
    grandTotal: Number(orderAmount.value),
    paidAt: Date(orderDetails.update_time),
    status: "Pending",
  });

  res.send(newOrder);
});

// @desc    get order by id
// @route   GET /api/orders/:id
// @access  Private and also admin
module.exports.getUserOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id });

  if (!order) {
    throw new ErrorResponse("Order not found", 404);
  }

  if (
    req.user.role !== "admin" &&
    req.user.role !== "superadmin" &&
    req.user._id.toString() !== order.user._id.toString()
  ) {
    throw new ErrorResponse("Access denied, not allowed", 403);
  }

  res.send(order);
});

// @desc    get user order list
// @route   GET /api/orders
// @access  Private
module.exports.getUserOrderList = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).send(orders);
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
module.exports.getOrderList = asyncHandler(async (req, res) => {
  const pageSize =
    Number(req.query.pageSize || process.env.PAGINATION_LIMIT) || 12;
  const page = Number(req.query.page) || 1;

  const query = {};
  if (req.query.order_id) {
    query.orderId = req.query.order_id;
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.ordered_after || req.query.ordered_before) {
    query.createdAt = {};

    if (req.query.ordered_after)
      query.createdAt.$gte = new Date(req.query.ordered_after);
    if (req.query.ordered_before)
      query.createdAt.$lt = new Date(req.query.ordered_before);
  }

  if (req.query.paid_after || req.query.paid_before) {
    query.createdAt = {};

    if (req.query.paid_after)
      query.paidAt.$gte = new Date(req.query.paid_after);
    if (req.query.ordered_before)
      query.paidAt.$lt = new Date(req.query.paid_before);
  }

  const count = await Order.countDocuments(query);

  const orders = await Order.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate({
      path: "user",
      select: "name email",
    });

  const pages = Math.ceil(count / pageSize);

  res.status(200).send({ orders, page, pages });
});

module.exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { id, status } = req.params;
  const updatedOrder = await Order.findOneAndUpdate(
    { orderId: id },
    { status: status },
    { new: true }
  );

  if (!updatedOrder) {
    throw new ErrorResponse("Order not found", 404);
  }

  res.status(200).send({ updatedOrder, message: "Product status updated" });
});
