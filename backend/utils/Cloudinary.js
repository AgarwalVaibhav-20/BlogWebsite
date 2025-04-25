import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    //UPLOAD THE FILE IN CLOUDINARY
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //FILE HAS BEEN UPLOADED SUCCESSFULLY
    console.log("File is Uploaded in cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally save temporary files as the upload operation got failed
    return null
  }
};



export {uploadOnCloudinary}