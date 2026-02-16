import Category from "../models/Category.model.js";


export const postcategory = async (req, res) => {
  try {
    const { name, subCategories } = req.body;
    const existcat = await Category.findOne({ name });
    if (existcat) {
      return res
        .status(400)
        .json({ sucess: false, msg: "this cat is already exist" });
    }
    const cat = new Category({
      name,
      subCategories,
    });
    await cat.save();
    res.status(201).json({ sucess: true, msg: "cat has been added" });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};
export const fetchcategory = async (req, res) => {
  try {
    const cat = await Category.find();
    if (!cat) {
      return res
        .status(404)
        .json({ sucess: false, msg: "not found a category" });
    }
    res.status(200).json({ sucess: true, cat });
  } catch (error) {

  }
};


