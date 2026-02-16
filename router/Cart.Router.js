import express from "express"
import { addtocart, cartview, decresequality, incresequantity, removecartitem } from "../controllers/Cart.Controller.js";
import { verifyuser } from "../middleware/authention.middleware.js";
const cartrouter=express.Router();
cartrouter.use(verifyuser)
cartrouter.post('/addtocart',addtocart);
cartrouter.post('/incresequanlity',incresequantity)
cartrouter.post('/decresequanlity',decresequality)
cartrouter.post('/removecartitem',removecartitem);
cartrouter.get('/cartview/:userid',cartview)
export  {cartrouter};