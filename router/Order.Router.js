import express from 'express';
import { getplaceorderstatus, placeorder, updateOrderStatus, viewoneorder, vieworders } from '../controllers/Order.controller.js';
import { verifyadmin, verifyuser } from '../middleware/authention.middleware.js';
const orderrouter=express.Router();
orderrouter.post('/placeorder',verifyuser,placeorder)
orderrouter.put('/updatestatus/:id',verifyadmin,updateOrderStatus);
orderrouter.get('/vieworder',verifyadmin,vieworders)
orderrouter.get('/viewoneorder/:id',verifyadmin,viewoneorder);
orderrouter.get('/getplaceorderstatus/:userid',verifyuser,getplaceorderstatus)
export {orderrouter}