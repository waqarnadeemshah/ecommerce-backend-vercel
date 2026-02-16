import Category from "../models/Category.model.js";
import Product from "../models/Product.model.js";
import { v2 as cloudinary } from "cloudinary";

export const postproduct = async (req, res) => {
  try {
    const {
      name,
      mainCategory,
      subCategory,
      price,
      sizes,
      description,
      highlights,
      details,
    } = req.body;

    const images = req.files.map((file) => ({
      src: file.path,
      alt: name,
      url: file.path,
      public_id: file.filename,
    }));
    const category = await Category.findById(mainCategory);
    if (!category) {
      return res
        .status(404)
        .json({ sucess: false, msg: "this category is not found " });
    }
    const subcat = category.subCategories.find(
      (sub) =>
        sub.name.toLowerCase() === subCategory.toLowerCase() ||
        sub.items
          .map((i) => i.toLowerCase())
          .includes(subCategory.toLowerCase())
    );
    if (!subcat) {
      return res
        .status(404)
        .json({ sucess: false, msg: "this sub category is not found " });
    }
    const product = new Product({
      name,
      mainCategory,
      subCategory,
      images,
      price,
      sizes: sizes ? JSON.parse(sizes) : [],
      description,
      highlights,
      details,
    });
    if (!product) {
      res.status(404).json({
        sucess: false,
        msg: "first fill all the detail for the product ",
      });
    }
    await product.save();
    res.status(201).json({ sucess: true, msg: "item has been added" });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};


export const fetchallproduct = async (req, res) => {
  try {
    const fetchproducts = await Product.find();
    if (!fetchproducts) {
      res.status(404).json({ msg: "no product " });
    }
    res.status(200).json({ sucess: true, fetchproducts });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};


export const deleteproduct = async (req, res) => {
  try {
    const paramsid = req.params.id;

   
    const product = await Product.findById(paramsid);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

  
    if (product.images && product.images.length > 0) {
      for (let img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }


    await Product.findByIdAndDelete(paramsid);

    return res
      .status(200)
      .json({ success: true, msg: "🗑️ Product & images deleted successfully" });
  } catch (err) {
 
    return res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
};
export const admingetoneproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productdet = await Product.findById({ _id: id })
    if (!productdet) {
      res.status(404).json({ sucess: false, msg: "not found a product" });
    }
    res.status(200).json({ sucess: true, productdet });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
}

export const updateproduct = async (req, res) => {
  try {
    const paramsid = req.params.id;
    const {
      name,
      mainCategory,
      subCategory,
      price,
      sizes,
      description,
      highlights,
      details,
    } = req.body;

    
    const existingProduct = await Product.findById(paramsid);
    if (!existingProduct) {
      return res.status(404).json({ sucess: false, msg: "no product " });
    }

    let finalImages = existingProduct.images;

    if (req.files && req.files.length > 0) {
   
      for (let img of existingProduct.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      const uploadedImages = req.files.map((file) => ({
        src: file.path, 
        alt: name || existingProduct.name,
        url: file.path,
        public_id: file.filename, 
      }));

      finalImages = uploadedImages;
    }


    const updateitem = await Product.findOneAndUpdate(
      { _id: paramsid },
      {
        name,
        mainCategory,
        subCategory,
        images: finalImages,
        price,
        sizes: sizes ? JSON.parse(sizes) : existingProduct.sizes,
        description,
        highlights,
        details,
      },
      { new: true }
    );

    if (!updateitem) {
      return res.status(404).json({ sucess: false, msg: "no product " });
    }

    res.status(201).json({ sucess: true, updateitem });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};
