import express from "express";
const router = express.Router();
import User from "../models/user.js";

// Search user by fullname or username with pagination
router.get("/searchbar", async (req, res) => {
  try {
    const { fullname, username, page = 1, limit = 10 } = req.query;

    console.log("Received Query Params:", { fullname, username, page, limit });

    // Build search conditions using $or
    let searchQuery = {};
    if (fullname || username) {
      searchQuery.$or = [];
      if (fullname?.trim()) {
        searchQuery.$or.push({ fullname: new RegExp(fullname, "i") });
      }
      if (username?.trim()) {
        searchQuery.$or.push({ username: new RegExp(username, "i") });
      }
    }

    console.log("Constructed Search Query:", JSON.stringify(searchQuery));

    // Convert page and limit to integers and apply pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch users with pagination and select fields explicitly
    const searchData = await User.find(searchQuery, "fullname username profilePhoto") 
      .skip(skip)
      .limit(limitNumber);

    console.log("Users Found:", searchData);

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);
    console.log("Total Users Found:", totalUsers);

    res.json({
      users: searchData,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
