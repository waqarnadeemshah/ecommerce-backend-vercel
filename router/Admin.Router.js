import express from "express";
import { admingetoneproduct, deleteproduct, fetchallproduct, postproduct, updateproduct } from "../controllers/Admin.Controller.js";
import { verifyadmin } from "../middleware/authention.middleware.js";
import upload from "../middleware/multer.middleware.js";
const adminroutes = express.Router();
adminroutes.use(verifyadmin)
adminroutes.post("/postproduct",upload.array('images',5),postproduct);
adminroutes.get('/fetchproduct',fetchallproduct)
adminroutes.delete('/delproduct/:id',deleteproduct)
adminroutes.get('/admingetoneproduct/:id',admingetoneproduct)
adminroutes.put('/updateproduct/:id', upload.array('images', 5), updateproduct)

export { adminroutes };
