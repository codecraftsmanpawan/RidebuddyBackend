// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const Register = require("./routes/register");
const Login = require("./routes/login");
const OfferRide = require("./routes/offerRide");
const BookRide = require("./routes/bookRide");
const Wallet = require("./routes/wallet");
const Vehicle = require("./routes/vehicle"); // Fixed spelling from "Vehical" to "Vehicle"
const Emergency = require("./routes/emergencyContacts");
const Verification = require("./routes/verification");
const Message = require("./routes/message");
const Community = require("./routes/community");
const Sos = require("./routes/sosRoutes");
const Prompt = require("./routes/prompt");
const Intrest = require("./routes/intrest");
const Banners = require("./routes/banner");
const Notification = require("./routes/notifications");
const router = require("./routes/currentRide");
const app = express();

// Middleware
const corsOptions = {
  origin: "*", // Adjust this to match your frontend's origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", Register);
app.use("/api", Login);
app.use("/api", OfferRide);
app.use("/api", BookRide);
app.use("/api", router);
app.use("/api", Wallet);
app.use("/api", Vehicle);
app.use("/api", Intrest);
app.use("/api", Prompt);
app.use("/api", Emergency);
app.use("/api", Verification);
app.use("/api", Message);
app.use("/api", Banners);
app.use("/api", Community);
app.use("/api", Sos);
app.use("/api", Notification);
// app.use('/api', Coupon); // Uncommented to include the Coupon route

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "An error occurred", error: err.message });
});

// Start the Server
const PORT = process.env.PORT || 5000; // Changed default port to 10000 to match your setup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
