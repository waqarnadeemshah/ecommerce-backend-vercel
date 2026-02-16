import express from "express"
import "dotenv/config"
import cors from "cors";
import mongoose from "mongoose";
import cookieparser from "cookie-parser"
import { adminroutes } from "./router/Admin.Router.js";
import { catroute } from "./router/Category.router.js";
import { authrouter } from "./router/Auth.Router.js";
import {cartrouter} from "./router/Cart.Router.js";
import { orderrouter } from "./router/Order.Router.js";
import { userRouter } from "./router/User.Router.js";
import { salesRouter } from "./router/Sales.Route.js";

const app=express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",  // frontend ka URL
  credentials: true,                
}));
app.use(cookieparser())



// router call endpoints
app.use('/api/admin',adminroutes)
app.use('/api/user',userRouter)
app.use('/api',catroute)
app.use('/api/auth',authrouter)
app.use('/api/cart',cartrouter)
app.use('/api/order',orderrouter)
app.use('/api/admin/sales',salesRouter)





mongoose.connect(process.env.MONGODBURI).then(()=>{
    console.log("database connect")
    app.listen(process.env.PORT,()=>{
        console.log(`port connect ${process.env.PORT}`)
    })
})