import { get } from "mongoose";
import cart from "../models/Cart.model.js";
import Order from "../models/Order.model.js";

export const placeorder = async (req, res) => {
  try {
    const { userid, shippingAddress, paymentMethod } = req.body;
    const cartdata = await cart.findOne({ userid }).populate("items.productid");
    if (!cartdata) {
      return res
        .status(404)
        .json({ sucess: false, msg: "first selct the items" });
    }
    const orderItems = cartdata.items.map((products) => ({
      product: products.productid._id,
      name: products.productid.name,
      selectedSize: products.selectedsize,
      quantity: products.quantity,
      price: products.productid.price,
      image: products.productid.images?.[0]
        ? {
            src: products.productid.images[0].src,
            alt: products.productid.images[0].alt,
            url: products.productid.images[0].url,
            public_id: products.productid.images[0].public_id,
          }
        : null,
    }));
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shippingPrice = itemsPrice === 5000 ? 0 : 50;
    const totalPrice = itemsPrice + shippingPrice;
    const newOrder = new Order({
      user: userid,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,

      totalPrice,
      orderStatus: "Pending",
      paymentstatus: "unpaid",
    });
    if (cartdata.items.length === 0) {
      return res
        .status(404)
        .json({ sucess: false, msg: "first selct the items" });
    }
    await newOrder.save();
    cartdata.items = [];
    await cartdata.save();

    res.status(201).json({
      sucess: true,
      msg: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentstatus } = req.body;
    const paramsid = req.params.id;
    if (!paramsid) {
      return res.status(404).json({ sucess: false, msg: "not found a item" });
    }
    const updataorderstatus = await Order.findByIdAndUpdate(paramsid, {
      orderStatus,
      paymentstatus,
    });
    res.status(200).json({
      sucess: true,
      msg: "update the status sucessfully",
      update: updataorderstatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const vieworders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders) {
      return res.status(404).json({ sucess: false, msg: "no orders yet" });
    }
    res.status(200).json({ sucess: true, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const viewoneorder = async (req, res) => {
  try {
    const { id } = req.params;
    const getoneorder = await Order.find({ _id: id })
      .populate("user")
      .populate("orderItems.product");
    if (!getoneorder) {
      res.status(404).json({ sucess: false, msg: "not found" });
    }
    res.status(200).json({ sucess: true, getoneorder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getplaceorderstatus = async (req, res) => {
  try {
    const { userid } = req.params;
    const order = await Order.find({ user: userid })
      .populate("user")
      .populate("orderItems.product")
      .sort({ createdAt: -1 })
      .select("-orderStatus");
    res.status(200).json({ sucess: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
