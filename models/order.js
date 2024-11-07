const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  sku: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  quantity: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

const shippingAddressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: Number, required: true },
  countryCode: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    orderItems: [orderItemSchema],

    shipping: {
      name: { type: String, required: true },
      address: shippingAddressSchema,
    },

    paymentMethod: String,

    paymentResult: {
      status: { type: String },
      update_time: { type: String },
      payer_id: { type: String },
      payer_name: { type: String },
      payer_email_address: { type: String },
    },

    itemsPrice: {
      type: Number,
      required: true,
    },

    totalTax: {
      type: Number,
      required: true,
      default: 0.0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    grandTotal: {
      type: Number,
      required: true,
      default: 0.0,
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },

    paidAt: { type: Date },

    status: { type: String },
  },

  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
