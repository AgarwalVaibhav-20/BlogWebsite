import dotenv from "dotenv";
import express from "express";
const app = express();
const PORT = 4000;
import cors from 'cors';
import DBConnect from "./DB/DBconnect.js";
import userSchema from "./routes/auth.js";
import searchbar from "./routes/searchbar.js";
import verification from "./routes/verifyUser.js";
import Image from './routes/Image.js';
// const WriteBlog = require('./routes/uploadingImagesWithCloudinary')

dotenv.config();
// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded data
app.use(cors());
DBConnect("mongodb://127.0.0.1:27017/Blogcom");

app.get("/", (req, res) => {
  res.send("hello worlds");
});

app.use("/api", userSchema);
app.use("/search", searchbar);
app.use("/authentication", verification);
app.use('/api', Image);
// app.use('/write' , WriteBlog)
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
