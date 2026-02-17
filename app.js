import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { adminroutes } from "./router/Admin.Router.js";
import { catroute } from "./router/Category.router.js";
import { authrouter } from "./router/Auth.Router.js";
import { cartrouter } from "./router/Cart.Router.js";
import { orderrouter } from "./router/Order.Router.js";
import { userRouter } from "./router/User.Router.js";
import { salesRouter } from "./router/Sales.Route.js";

const app = express();


// middleware
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ecommerce-frontend-vercel-ebi8.vercel.app/a" 
  ],
  credentials: true
}));

app.use(cookieParser());


// TEST ROUTE (important for Vercel)
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});


// routes
app.use("/api/admin", adminroutes);
app.use("/api/user", userRouter);
app.use("/api", catroute);
app.use("/api/auth", authrouter);
app.use("/api/cart", cartrouter);
app.use("/api/order", orderrouter);
app.use("/api/admin/sales", salesRouter);



let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODBURI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
};

connectDB();


// IMPORTANT: export app
export default app;
