require("dotenv").config();
require("express-async-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
require("express-async-errors");
const express = require("express");

// const cron = require("node-cron");

const app = express();
const  http = require('http').Server(app);
const authRoutes = require("./routes/authRoutes");
const postRoutes=require("./routes/postRoutes");
const chatRoutes = require("./routes/chatRoutes");

// const uploadRoutes = require("./routes/uploadRoutes");
// const activityRoutes = require("./routes/ActivityRoutes");
const cloudinary = require("cloudinary").v2;




cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 500,
  })
);
app.use(helmet());
app.use(
  cors({
    methods: "GET, POST, PUT,PATCH",
  })
);

app.use((req, res, next) => {
  console.log("origin ", req.headers.origin);
  let allowedOrigins = [
    "https://fms-v1-test.netlify.app",
    "https://labour-connect.com",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:5173",
    "https://fms.loadlc.com",
  ];
  let origin = req.headers.origin;
  //cconsole.log("origin ", origin);
  //  origin = 'http://localhost:3000/'
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH");
  // res.setHeader("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "TRUE");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("Strict-Transport-Security", "max-age=31536000");
  res.header("X-Frame-Options", "SAMEORIGIN");
  res.header("X-Content-Type-Options", "nosniff");

  if (res.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH");
    return res.status(204).json({});
  }
  next();
});
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/v1/Trills", authRoutes);
app.use("/api/v1/Trills", postRoutes);
app.use("/api/v1/Trills", chatRoutes);


app.get("/health", (req, res) => {
  res.sendStatus(200);
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



const port = process.env.PORT || 8000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
