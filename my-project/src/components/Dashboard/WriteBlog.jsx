// import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import imageOne from "../Assets/blogBanner.png";
const WriteBlog = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(imageOne);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  // const [title, setTitle] = useState("");
  // const [content, setContent] = useState("");
  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      //enter key
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
  };
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    uploadToCloudinary(file);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blogPresetUpload"); // 👈 your unsigned preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dl24bk99m/image/upload",
        formData
      );
      const imageUrl = res.data.secure_url;
      setUploadedImageUrl(imageUrl);
      console.log("Image uploaded:", imageUrl);
    } catch (err) {
      console.error(" Upload failed:", err);
    }
  };

  return (
    <>
      <nav className="flex justify-center items-center w-full p-3 ">
        <a href="/" className="flex-none w-10">
          <img
            width="60"
            height="60"
            src="https://img.icons8.com/clouds/100/b.png"
            alt="Logo"
          />
        </a>
        <p className="max-md:hidden text-black line-clamp-1 w-full">New Blog</p>
        <div className="flex gap-2 md:gap-4 ml-auto">
        {/* Publish button */}
        <button className="flex space-x-1 md:space-x-3 justify-center items-center border px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl bg-[#212121] text-white text-sm md:text-base">
          <span>Publish</span>
        </button>

        {/* Save Draft button */}
        <button className="flex px-2 py-1 md:px-4 md:py-2 justify-center items-center border rounded-xl md:rounded-2xl btn-light text-black text-sm md:text-base space-x-1">
          <span className="hidden xxs:inline">Save</span>
          <span className="hidden sm:inline"> Draft</span>
          <span className="inline xxs:hidden">💾</span>
        </button>
        </div>
      </nav>
      <div className="mx-auto max-w-[900px] p-4">
        <div className="relative aspect-video border-4 border-gray-100 hover:opacity-80 mb-4">
          <label htmlFor="uploadBanner">
            <img
              src={previewUrl}
              alt="banner"
              className="object-cover w-full h-full"
            />
            <input
              id="uploadBanner"
              type="file"
              accept=".png,.jpg,.jpeg"
              hidden
              onChange={handleBannerUpload}
            />
          </label>
        </div>
        <textarea
          placeholder="Blog Title"
          className="text-4xl h-20 font-medium w-full outline-none resize-none mt-10 leading-tight placeholder:opacity-40 "
          onKeyDown={handleTitleKeyDown}
          onChange={handleTitleChange}
        ></textarea>
      </div>
    </>
  );
};

export default WriteBlog;
