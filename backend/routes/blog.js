import express from "express";
import Blog from "../models/Blog.js"; // Ensure correct path

const router = express.Router();

// Create a new blog
router.post("/", async (req, res) => {
  try {
    const blog = new Blog(req.body);  // ✅ No name conflict
    const savedBlog = await blog.save();
    res.status(201).json({ success: true, blog: savedBlog }); // ✅ Returns success flag
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "-password")
      .populate("comments");
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "-password")
      .populate("comments");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a blog
router.put("/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBlog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, blog: updatedBlog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete a blog
router.delete("/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
