const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRouter = require("./controller/auth");
const jobApplicationRouter = require("./controller/jobApplication");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  credentials: true, // Allow cookies to be sent and received
};

dotenv.config();
const app = express();

Promise.resolve()
  .then(() => {
    // MongoDB init
    return mongoose.connect(process.env.MONGO_URI, {}).then(() => {
      console.log("MongoDB connection established");
    });
  })
  .then(() => {
    // Add middlewares
    app.use(cors(corsOptions)); // Add CORS middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Custom middleware
    app.use((req, res, next) => {
      console.log(
        `API Logging --- METHOD: ${req.method} URL: ${req.originalUrl} BODY: ${
          req.body ? JSON.stringify(req.body) : "Empty"
        }`
      );
      next();
    });
  })
  .then(() => {
    app.get("/", (req, res) => {
      return res.send("Greetings! Welcome to Job Tracker API.");
    });

    app.use("/auth", authRouter);
    app.use("/job-application", jobApplicationRouter);
  })
  .then(() => {
    // Error handler middleware
    app.use((err, req, res, next) => {
      res.status(400).json({
        message: "Request failed.",
        data: {},
        error: err.message ? err.message : err.toString(),
      });
      next();
    });
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Job tracker API is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Job tracker API start error");
    console.log("Error: ", error);
    process.exit(1);
  });
