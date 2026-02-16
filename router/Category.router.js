import express from "express";
import { fetchcategory,  postcategory } from "../controllers/Category.Controller.js";
import { verifyadmin, verifyuser } from "../middleware/authention.middleware.js";
const catroute=express.Router();
catroute.post('/postcat',verifyadmin,postcategory);
catroute.get('/fetchallcat',fetchcategory);

export {catroute}