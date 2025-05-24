import express from "express";
const router = express.Router();
import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import path from "path";
import Image from "../models/Image.js";
import {nanoid} from "nanoid";
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Configure multer for local storage (temporarily)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join("/uploads"); // const uploadDir = path.join(__dirname, "../uploads");

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

router.get("/get-upload-url", (req, res) => {
  try {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
    
    res.json({
      imageName,
      folder: "blog_uploads",
      message: "You can use this image name to upload to Cloudinary",
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});
// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

// Set up Multer with local storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large. Maximum size is 5MB.",
      });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// API endpoint for image upload
router.post(
  "/upload-image",
  upload.single("image"),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_uploads",
        transformation: [{ width: 1200, crop: "limit" }, { quality: "auto" }],
      });

      // Delete the local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);

      // Create image document in database
      const imageData = {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      };

      // If you have authentication, you can add the user ID
      // if (req.user) {
      //   imageData.uploaded_by = req.user._id;
      // }

      const newImage = new Image(imageData);
      await newImage.save();

      // Return image details
      res.status(201).json({
        message: "Image uploaded successfully",
        url: result.secure_url,
        public_id: result.public_id,
        _id: newImage._id,
        format: result.format,
      });
    } catch (error) {
      console.error("Error in upload route:", error);
      res.status(500).json({ error: "Upload failed: " + error.message });
    }
  }
);

router.get("/get-upload-url", (req, res) => {
  generateUploadURL();
});

// API endpoint to delete an image
router.delete("/images/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Delete from database
    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// API endpoint to get all images (can be paginated)
router.get("/images", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const images = await Image.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Image.countDocuments();

    res.json({
      images,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalImages: total,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 3c9d585384a71df632648a8f872deb8697371209
