import { check, cookie, validationResult } from "express-validator";
import brcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../models/User.model.js";
export const signup = [
  check("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("first name should be 2 lenght longer")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("name contains alphabets only !!!"),

  check("email")
    .isEmail()
    .withMessage("Please enter the email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password length should be atleast 6 longer")
    .matches(/^[A-Za-z0-9\s]+$/),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ sucess: false, errors: error.array() });
      }
      const existemail = await user.findOne({ email });
      if (existemail) {
        return res
          .status(400)
          .json({ sucess: false, msg: "already email is register" });
      }
      const hashedpass = await brcrypt.hash(password, 10);
      const userdata = new user({
        name,
        email,
        password: hashedpass,
        role
      });
      await userdata.save();
      res.status(201).json({ sucess: true, msg: "user has been added" });
    } catch (err) {
      res.status(500).json({ sucess: false, error: err.message });
    }
  },
];
const generateaccesstoken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.ACCESSTOKEN,
    { expiresIn: "1h" }
  );
};
const generateresfresstoken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESHTOKEN, {
    expiresIn: "7d",
  });
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userdata = await user.findOne({ email });
    if (!userdata) {
      return res.status(404).json({ sucess: false, msg: "user not found" });
    }
    const checkpass = await brcrypt.compare(password, userdata.password);
    if (!checkpass) {
      return res
        .status(404)
        .json({ sucess: false, msg: "password is incorrect" });
    }
    const acesstoken = generateaccesstoken(userdata);
    const refreshtoken = generateresfresstoken(userdata);
    userdata.refreshtoken = refreshtoken;
    await userdata.save();
    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,

      secure: false,  
  sameSite: "lax"
    });
    res.status(200).json({
      sucess: true,
      acesstoken,
      userid: userdata._id,
      userrole: userdata.role,
      username: userdata.name,
    });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};
export const regeneratetoken = async (req, res) => {
  try {
    const refreshtoken = req.cookies.refreshtoken;
    const userdata = await user.findOne({ refreshtoken });
    if (!userdata) {
      return res
        .status(404)
        .json({ sucess: false, msg: "not match refreshtoken" });
    }
    const decode = jwt.verify(refreshtoken, process.env.REFRESHTOKEN);
    // userdata = findOne({ _id: id });
    const regenerateacesstoken = generateaccesstoken(userdata);
    const reregenreatefreshtoken = generateresfresstoken(userdata);
    userdata.refreshtoken = reregenreatefreshtoken;
    await userdata.save();
    res.cookie("refreshtoken", reregenreatefreshtoken ,{
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({
      sucess: true,
      regenerateacesstoken,
      userid: userdata._id,
      userrole: userdata.role,
      username: userdata.name,
    });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshtoken = req.cookies.refreshtoken;
    if (!refreshtoken) {
      return res.status(404).json({ sucess: false, msg: "token is  mission" });
    } else {
      const userdata = await user.findOne({ refreshtoken });
      userdata.refreshtoken = null;
       await userdata.save();
    }
    res.clearCookie("refreshtoken");
    res.status(200).json({ sucess: true, msg: "loggout sucessfully" });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};
