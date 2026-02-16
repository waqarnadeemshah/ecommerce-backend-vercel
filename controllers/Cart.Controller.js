
import cart from "../models/Cart.model.js";

export const addtocart = async (req, res) => {
  try {
    const { userid, productid, selectedsize, quantity = 1 } = req.body;

    let cartdata = await cart.findOne({ userid });

    if (!cartdata) {
      cartdata = new cart({
        userid,
        items: [{ productid, selectedsize, quantity }],
      });
      await cartdata.save();  
      return res.status(201).json({
        sucess: true,
        msg: "New cart created & item added",
        cart: cartdata,
      });
    }


    const existitem = cartdata.items.find(
      (product) =>
        product.productid.toString() === productid &&
        product.selectedsize === selectedsize
    );

    if (existitem) {
      return res
        .status(400)
        .json({ sucess: false, msg: "this item is already in the cart" });
    }

    cartdata.items.push({ productid, selectedsize, quantity });
    await cartdata.save();

    res.status(201).json({
      sucess: true,
      msg: "Item has been added",
      cart: cartdata,
    });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};

export const incresequantity = async (req, res) => {
  try {
    const { userid, productid, selectedsize } = req.body;


    let cartdata = await cart.findOne({ userid });

    if (!cartdata) {
      return res.status(404).json({ sucess: false, msg: "Cart not found" });
    }

    const itemcheck = cartdata.items.find(
      (product) =>
        product.productid.toString() === productid &&
        product.selectedsize === selectedsize
    );

    if (!itemcheck) {
      return res.status(404).json({ sucess: false, msg: "Item not found in cart" });
    }


    itemcheck.quantity += 1;


    await cartdata.save();

    res
      .status(200)
      .json({ sucess: true, msg: "Quantity increased", cart: cartdata });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};

export const decresequality=async(req,res)=>{
  try {
    const {userid,productid,selectedsize}=req.body;
    const cartdata=await cart.findOne({userid});
    if(!cartdata){
      return res.status(404).json({sucess:false,msg:"not found a cart item"});
    }
  const itemcheck = cartdata.items.find(
   (p) => p.productid.toString() === productid && p.selectedsize === selectedsize
);

    if(!itemcheck){
      return res.status(404).json({sucess:false,msg:"item not found"})
    }
    if(itemcheck.quantity>1){
      itemcheck.quantity-=1;
    }
    await cartdata.save();
    res.status(200).json({sucess:true,cart:cartdata})

  
  } catch (err) {
       res.status(500).json({ sucess: false, error: err.message })
  }
}
export const removecartitem=async(req,res)=>{
  try {
    const {userid,productid,selectedsize}=req.body;
    const cartdata=await cart.findOne({userid});
    if(!cartdata){
      return res.status(404).json({ sucess: false, msg: "item not found" });
    }
    const removetem=cartdata.items.filter((products)=>
      !(products.productid.toString()===productid&&products.selectedsize===selectedsize)
    )
    cartdata.items=removetem;
     await cartdata.save();
    res.status(200).json({sucess:true,msg:"item removed"})
    
  } catch (err) {
       res.status(500).json({ sucess: false, error: err.message })
  }
}

export const cartview=async(req,res)=>{
  try {
    const {userid}=req.params;
     const cartdata = await cart
      .findOne({ userid:userid.toString() })
      .populate({
        path: "items.productid",   
        select: "name images subCategory highlights price", 
      });
    if(!cartdata){
        return res.status(404).json({sucess:true,msg:"not found a items"})
    }
    res.status(200).json({sucess:true,cartdata})
  } catch (err) {
       res.status(500).json({ sucess: false, error: err.message })
  }
}
export const decresequalityy=async(req,res)=>{
  try {
    const {productid,selectedsize,guestid}=req.body;
    const usedid=req.usertoken.id;
    let cart
    if(usedid){
cart=await cart.findOne({usedid});
    }
    else{
      cart=await cart.findOne({guestid})
    }
const itemcheck=cart.items.find((p)=>p.productid===productid&&p.selectedsize===selectedsize);
if(!cart){
  res.status(404).json({msg:"not found"});
}
if(cart.quantity>1){
  cart.quantity--
}
   await cartdata.save();
    res.status(200).json({sucess:true,cart:cartdata})
  } catch (error) {
     res.status(500).json({ sucess: false, error: err.message })
  }
}