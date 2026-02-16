import mongoose from "mongoose";
const cartschema = mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      selectedsize: {
        type: String,
        enum: ["S", "M", "L", "XL"],

        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
});
const cart=mongoose.model('Cart',cartschema);
export default cart
