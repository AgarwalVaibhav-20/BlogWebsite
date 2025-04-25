// src/pages/BlogList.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const YourBlog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-[900px] mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">📝 Latest Blogs</h2>

      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="border p-4 rounded mb-6 shadow-sm">
            {blog.image && (
              <img
                src={blog.image}
                alt="Blog Banner"
                className="w-full h-60 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
            <p className="text-gray-700 mb-2">
              {blog.content.length > 150
                ? blog.content.substring(0, 150) + "..."
                : blog.content}
            </p>
            <Link to={`/blog/${blog._id}`} className="text-blue-600 underline">
              Read More
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default YourBlog;
