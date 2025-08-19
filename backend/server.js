const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

dotenv.config();
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL, 
      "http://localhost:5173"  
    ],
    credentials: true,
  })
);
app.use(express.json());
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/cart", auth, require("./routes/cart"));
app.use("/api/orders", require("./routes/order"));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
