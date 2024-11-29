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

    paidAt: { type: Date },

    status: {
      type: String,
      trim: true,
      enum: [
        "Pending", // Triggered by: Customer Action, The customer has placed the order, but payment or confirmation is not yet processed.
        "Processing", // Triggered by: System/Store Action, Payment is confirmed, and the store starts preparing the order (packing, etc.).
        "Shipped", // Triggered by: Store Action, The store has packed and dispatched the order to the shipping carrier.
        "Delivered", // Triggered by: System Action (sometimes updated manually by the store or shipping service), The shipping carrier confirms that the order has been delivered to the customer.
        "Completed", // Triggered by: System/Customer Action, The customer confirms receipt or the system marks it completed after delivery.
        "Cancelled", // Triggered by: Customer or Store Action, The customer cancels the order before shipment, or the store cancels due to issues (e.g., stock or payment problems).
        "Refunded", // Triggered by: Store Action, The store processes a refund, either after the customer returns a product or requests cancellation.
        "Returned", // Triggered by: Customer Action, The customer initiates a return, and the "system/store" processes it to mark the status accordingly.
        "On Hold", // Triggered by: Store/System Action, The order is paused for manual review, stock issues, or awaiting further payment verification.
        "Failed", // Triggered by: System Action, The payment system fails to process the order due to card rejection or other payment issues.
      ],
      default: "Pending",
    },
  },

  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
