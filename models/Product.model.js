import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Category",
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        src: { type: String, required: true },
        alt: { type: String, required: true },

        url: String,
        public_id: String,

        _id: false,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    sizes: [
      {
        name: {
          type: String,
          enum: ["S", "M", "L", "XL"],
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
        },
        _id: false,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    highlights: {
      type: String,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
