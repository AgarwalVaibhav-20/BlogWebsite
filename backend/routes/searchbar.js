const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Search user by fullname or email with pagination
router.get("/searchbar", async (req, res) => {
  try {
    const { fullname, email, page = 1, limit = 10 } = req.query;

    console.log("Received Query Params:", { fullname, email, page, limit });

    // Build search conditions using $or
    let searchQuery = {};
    if (fullname || email) {
      searchQuery.$or = [];
      if (fullname?.trim()) {
        searchQuery.$or.push({ fullname: new RegExp(fullname, "i") });
      }
      if (email?.trim()) {
        searchQuery.$or.push({ email: new RegExp(email, "i") });
      }
    }

    console.log("Constructed Search Query:", JSON.stringify(searchQuery));

    // Convert page and limit to integers and apply pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch users with pagination and select fields explicitly
    const searchData = await User.find(searchQuery, "fullname email profilePhoto") 
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

module.exports = router;
