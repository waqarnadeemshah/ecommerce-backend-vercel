import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
      trim: true,
      unique:true
    },
    subCategories: [
      {
        name: {
          type: String,
          required: true, 
          trim: true,
        },
        items: [
          {
            type: String, 
            required: true,
            trim: true,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
