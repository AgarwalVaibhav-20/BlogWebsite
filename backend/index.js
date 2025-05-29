import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import DBConnect from "./DB/DBconnect.js";
import userSchema from "./routes/auth.js";
import searchbar from "./routes/searchbar.js";
import verification from "./routes/verifyUser.js";
import Image from "./routes/imageRoute.js";
import blog from "./routes/blog.js";

dotenv.config();

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));

DBConnect("mongodb://127.0.0.1:27017/Blogcom");

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
app.use("/api/blogs", blog); // ✅ Updated path
app.use("/api", userSchema);
app.use("/search", searchbar);
app.use("/authentication", verification);
app.use("/api", Image);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
