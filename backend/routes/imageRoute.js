import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import Image from "../models/Image.js";
import { nanoid } from "nanoid";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for temporary local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join("./uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});
console.log(storage)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// 🔹 Generate a unique name for frontend image uploads
router.get("/get-upload-url", (req, res) => {
  try {
    const imageName = `${nanoid()}-${Date.now()}.jpeg`;
    res.json({
      imageName,
      folder: "blog_uploads",
      message: "Use this image name to upload to Cloudinary",
    });
    console.log(imageName)
  } catch (error) {
    console.error("Upload URL generation error:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

// 🔹 Save Cloudinary upload info to DB
router.post("/upload-image", async (req, res) => {
  try {
    const {
      secure_url,
      public_id,
      format,
      width,
      height,
      bytes
    } = req.body;

    const imageData = {
      url: secure_url,
      public_id,
      format,
      width,
      height,
      bytes,
    };

    const newImage = new Image(imageData);
    await newImage.save();

    res.status(201).json({
      message: "Image uploaded and saved successfully",
      url: secure_url,
      public_id,
      _id: newImage._id,
      format,
    });
  } catch (error) {
    console.error("Error saving image data:", error);
    res.status(500).json({ error: "Upload failed: " + error.message });
  }
});

// 🔹 Get paginated images
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
    console.error("Fetching images failed:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// 🔹 Delete image by ID
router.delete("/images/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    await cloudinary.uploader.destroy(image.public_id);
    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

export default router;





// import express from "express";
// const router = express.Router();
// import multer from "multer";
// import {v2 as cloudinary} from "cloudinary";
// import fs from "fs";
// import path from "path";
// import Image from "../models/Image.js";
// import {nanoid} from "nanoid";
// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });


// // Configure multer for local storage (temporarily)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = path.join("./uploads"); // const uploadDir = path.join(__dirname, "../uploads");

//     // Create the uploads directory if it doesn't exist
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//     );
//   },
// });

// router.get("/get-upload-url", (req, res) => {
//   try {
//     const date = new Date();
//     const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
    
//     res.json({
//       imageName,
//       folder: "blog_uploads",
//       message: "You can use this image name to upload to Cloudinary",
//     });
//   } catch (error) {
//     console.error("Error generating upload URL:", error);
//     res.status(500).json({ error: "Failed to generate upload URL" });
//   }
// });
// // File filter to accept only images
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Not an image! Please upload only images."), false);
//   }
// };

// // Set up Multer with local storage
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: fileFilter,
// });

// // Error handling middleware for multer
// const handleMulterError = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     if (err.code === "LIMIT_FILE_SIZE") {
//       return res.status(400).json({
//         error: "File too large. Maximum size is 5MB.",
//       });
//     }
//     return res.status(400).json({ error: err.message });
//   }
//   if (err) {
//     return res.status(400).json({ error: err.message });
//   }
//   next();
// };

// // API endpoint for image upload
// router.post(
//   "/upload-image",
//   async (req, res) => {
//     try {
//       const response = req.body;

//       // Create image document in database

//       const imageData = {
//         url: response.secure_url,
//         public_id: response.public_id,
//         format: response.format,
//         width: response.width,
//         height: response.height,
//         bytes: response.bytes,
//       };

//       console.table(imageData)

//       const newImage = new Image(imageData);
//       await newImage.save();

//       // Return image details
//       res.status(201).json({
//         message: "Image uploaded successfully",
//         url: response.secure_url,
//         public_id: response.public_id,
//         _id: newImage._id,
//         format: response.format,
//       });

//     } catch (error) {
//       console.error("Error in upload route:", error);
//       res.status(500).json({ error: "Upload failed: " + error.message });
//     }
//   }
// );

// router.get("/get-upload-url", (req, res) => {
//   generateUploadURL();
// });

// // API endpoint to delete an image
// router.delete("/images/:id", async (req, res) => {
//   try {
//     const image = await Image.findById(req.params.id);

//     if (!image) {
//       return res.status(404).json({ error: "Image not found" });
//     }

//     // Delete from Cloudinary
//     await cloudinary.uploader.destroy(image.public_id);

//     // Delete from database
//     await Image.findByIdAndDelete(req.params.id);

//     res.json({ message: "Image deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting image:", error);
//     res.status(500).json({ error: "Failed to delete image" });
//   }
// });

// // API endpoint to get all images (can be paginated)
// router.get("/images", async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;

//     const images = await Image.find()
//       .sort({ created_at: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Image.countDocuments();

//     res.json({
//       images,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       totalImages: total,
//     });
//   } catch (error) {
//     console.error("Error fetching images:", error);
//     res.status(500).json({ error: "Failed to fetch images" });
//   }
// });

// export default router;
