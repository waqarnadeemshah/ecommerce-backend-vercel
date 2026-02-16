import express from "express"
import { getMonthlyRevenue, getsalesrecord, totalsale } from "../controllers/AdminSales.Controller.js";
import { verifyuser } from "../middleware/authention.middleware.js";
const salesRouter=express.Router();
salesRouter.use(verifyuser)
salesRouter.get('/totalsale',totalsale)
salesRouter.get("/getsalesrecord",getsalesrecord)
salesRouter.get("/getmonthlyrevenue",getMonthlyRevenue)
export {salesRouter};