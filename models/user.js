const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ErrorResponse = require("../utilities/errorResponse");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: Buffer,
    },

    role: {
      type: String,
      trim: true,
      enum: ["customer", "admin", "superadmin"],
      default: "customer",
    },

    tokens: [
      {
        type: String,
        required: true,
      },
    ],
  },

  {
    timestamps: true,
  }
);

//hash and salting password with middleware "Pre Hook"
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//comparing passwoed with static method
userSchema.statics.findByCredentials = async (email, enteredPassword) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ErrorResponse("Invalid email or password", 400);
  }

  const isMatch = await bcrypt.compare(enteredPassword, user.password);

  if (!isMatch) {
    throw new ErrorResponse("Invalid email or password", 400);
  }

  return user;
};

// generate auth token with instance method
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  this.tokens = this.tokens.concat(token);
  await this.save();

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
