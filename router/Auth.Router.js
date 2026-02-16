import express from "express"
import { login, logout, regeneratetoken, signup } from "../controllers/Auth.Controller.js";

const authrouter=express.Router();
authrouter.post('/signup',signup)
authrouter.post('/login',login)
authrouter.post('/regeneratetoke',regeneratetoken);
authrouter.post('/logout',logout)
export {authrouter}