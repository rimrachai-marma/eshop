require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
// const cors = require("cors");
const morgan = require("morgan");

const { notFound, errorHandler } = require("./middleware/error");
const { imageUpload } = require("./middleware/multer");
const ErrorResponse = require("./utilities/errorResponse");

//App Config
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));

  // for dev purpose
  app.use((req, res, next) => {
    const delay = 1000; // delay in milliseconds
    setTimeout(() => {
      next();
    }, delay);
  });
}

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/product"));
app.use("/api", require("./routes/category"));
app.use("/api", require("./routes/order"));
app.post(
  "/api/upload/image",
  imageUpload.single("image"),
  (req, res) => {
    if (!req.file) {
      throw new ErrorResponse("Please select an image", 400);
    }

    res.json("/" + req.file.path);
  },
  (err, req, res, next) => {
    throw new ErrorResponse(err.message, 400);
  }
);

app.get("/api/config/tax_rate", (req, res) =>
  res.send({
    taxRate: process.env.TAX_RATE || 10,
  })
);
app.get("/api/config/paypal_client_id", (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/dist")));

  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "./", "client", "dist", "index.html")));
} else {
  app.get("/", (req, res) => res.json({ message: "✅ Server is healthy" }));
}

app.use(notFound);
app.use(errorHandler);

//DB Config
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log(
      `Mongodb Connected to: \x1b[36m${conn.connection.host}\x1b[0m, \x1b[1m${conn.connection.name}\x1b[0m on PORT \x1b[1m${conn.connection.port}\x1b[0m`
    );

    //Listener
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () =>
      console.log(`Server running on PORT \x1b[1m${PORT}\x1b[0m\n  \x1b[32m➜\x1b[0m  \x1b[1mLocal:\x1b[0m\t\x1b[36mhttp://localhost:${PORT}\x1b[0m`)
    );
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB,\nError: ", err.message);
  });
