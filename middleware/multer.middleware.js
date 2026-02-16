import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/Cloudinary.js";


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mern_project/products",  
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });

export default upload;
