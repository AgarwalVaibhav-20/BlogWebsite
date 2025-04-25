const express = require("express");
const app = express();
const PORT = 4000;
const cors = require('cors')
const { DBConnect } = require("./DB/DBconnect");
const userSchema = require("./routes/auth");
const searchbar = require("./routes/searchbar");
const verification = require("./routes/verifyUser");
const Image = require('./routes/Image')
// const WriteBlog = require('./routes/uploadingImagesWithCloudinary')

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
