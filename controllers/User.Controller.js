import Product from "../models/Product.model.js";

export const getallproduct = async (req, res) => {
  try {
    const product = await Product.find();
    if (!product) {
      return res.status(404).json({ sucess: false, msg: "no orders yet" });
    }
    res.status(200).json({ sucess: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getproductbycat = async (req, res) => {
  try {
    const { maincatid, subcat } = req.params;
    let product;
    if (!subcat) {
      product = await Product.find({ mainCategory: maincatid }).populate(
        "mainCategory",
        "name"
      );
    } else {
      product = await Product.find({
        mainCategory: maincatid,
        subCategory: subcat,
      }).populate("mainCategory", "name");
    }
    if (!product || product.length === 0) {
      return res.status(404).json({ sucess: false, msg: "no product found" });
    }
    res.status(200).json({ sucess: true, count: product.length, product });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};
export const getoneproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productdet = await Product.findById({ _id: id }).select(
      "-sizes.stock"
    );
    if (!productdet) {
      res.status(404).json({ sucess: false, msg: "not found a product" });
    }
    res.status(200).json({ sucess: true, productdet });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};
export const sortingproducts = async (req, res) => {
  try {
    const {mainCategory,subCategory}=req.params
    const { sort } = req.query;
    const sortoption = {};
    if (sort === "HightoLow") {
      sortoption.price = -1;
    } else if (sort === "LowtoHigh") {
      sortoption.price = 1;
    } else if (sort === "Newest") {
      sortoption.createdAt = -1;
    }
    const products = await Product.find({mainCategory,subCategory}).sort(sortoption);
    res.status(200).json({ sucess: true, products });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};
export const searchProducts = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || search.trim() === "") {
      return res.status(200).json({
        success: true,
        products: [],
      });
    }

    const products = await Product.find({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

