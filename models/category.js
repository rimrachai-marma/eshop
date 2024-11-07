const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
    unique: true,
  },
  description: {
    type: String,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  brands: [{ type: String }],
});

categorySchema.pre("save", function (next) {
  if (this.brands && this.brands.length > 0) {
    this.brands = this.brands.map((brand) => {
      return (brand = brand
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" "));
    });
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
