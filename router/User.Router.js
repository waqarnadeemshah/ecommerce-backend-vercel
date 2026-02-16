import express from "express";
import {
  getallproduct,
  getoneproduct,
  getproductbycat,
  searchProducts,
  sortingproducts,
} from "../controllers/User.Controller.js";

const userRouter = express.Router();

userRouter.get("/getallproduct", getallproduct);
userRouter.get("/getproductbycat/:maincatid/:subcat", getproductbycat);
userRouter.get("/getoneproduct/:id", getoneproduct);
userRouter.get("/sortproduct/:mainCategory/:subCategory", sortingproducts);
userRouter.get("/search",searchProducts)
export { userRouter };
