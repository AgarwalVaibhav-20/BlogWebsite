import { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import toast, { Toaster } from "react-hot-toast";

import AnimationWrapper from "@/common/page-animation";
import { EditorContext } from "../components/editor.pages";
import { tools } from "./Tools.components";
import { uploadImageToCloudinaryRemote } from "./helper/uploadImage";
import blogBanner from "./Assets/blogBanner.png";
import PublishForm from "./publish-from.component";

// Axios base config
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.timeout = 30000;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, Promise.reject);

const BlogEditor = () => {
  const {
    blog,
    blog: { title = "", banner = "", content = {} },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  const [editorReady, setEditorReady] = useState(false);
  const [bannerImage, setBannerImage] = useState(banner || blogBanner);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishForm, setShowPublishForm] = useState(false);

  const bannerInputRef = useRef(null);

  useEffect(() => {
    const editor = new EditorJS({
      holderId: "textEditor",
      data: content,
      tools,
      placeholder: "Let's write awesome text",
      onReady: () => {
        setTextEditor(editor);
        setEditorReady(true);
      },
    });

    return () => {
      editor.isReady
        .then(() => editor.destroy())
        .catch((e) => console.warn("Editor cleanup failed:", e));
    };
  }, []);

  const handleBannerUpload = (e) => {
    const img = e.target.files[0];
    if (!img) return;

    const loadingToast = toast.loading("Uploading...");
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!validTypes.includes(img.type)) {
      toast.error("Select a valid image file (JPG/PNG)", { id: loadingToast });
      return;
    }

    if (img.size > 5 * 1024 * 1024) {
      toast.error("Image size must be < 5MB", { id: loadingToast });
      return;
    }

    setFile(img);

    const reader = new FileReader();
    reader.onload = () => setBannerImage(reader.result);
    reader.readAsDataURL(img);

    uploadImageToCloudinary(img, loadingToast);
  };

  const uploadImageToCloudinary = async (imageFile, toastId = null) => {
    try {
      setUploading(true);
      const result = await uploadImageToCloudinaryRemote(imageFile);
      if (!result) throw new Error("Upload failed");

      const response = await axios.post(import.meta.env.VITE_SERVER_UPLOAD, result);

      if (response.data?.url) {
        setUploadedImage(response.data);
        setBannerImage(response.data.url);
        setBlog({ ...blog, banner: response.data.url });
        if (toastId) toast.success("Uploaded successfully!", { id: toastId });
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err) {
      toast.error("Image upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleTitleChange = (e) => {
    const input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  const generateDescription = (editorData) => {
    const firstParagraph = editorData.blocks.find(
      (block) => block.type === "paragraph" && block.data.text
    );
    if (!firstParagraph) return "";
    const text = firstParagraph.data.text.replace(/<[^>]*>/g, "");
    return text.length > 150 ? text.slice(0, 150) + "..." : text;
  };

  const handlePublishEvent = async () => {
    if (!bannerImage || bannerImage === blogBanner) {
      return toast.error("Upload a banner before publishing.");
    }

    if (!title.trim().length) {
      return toast.error("Enter a blog title.");
    }

    if (!editorReady || !textEditor) {
      return toast.error("Editor not ready yet.");
    }

    setIsPublishing(true);
    const toastId = toast.loading("Publishing...");

    try {
      await textEditor.isReady;
      const editorData = await textEditor.save();

      if (!editorData.blocks.length) {
        toast.error("Write something to publish.", { id: toastId });
        return;
      }

      let finalBanner = bannerImage;
      if (file && !uploadedImage) {
        await uploadImageToCloudinary(file);
        finalBanner = uploadedImage?.url || bannerImage;
      }

      const user = JSON.parse(localStorage.getItem("userData") || "{}");

      const blogData = {
        title: title.trim(),
        banner: finalBanner,
        content: editorData,
        description: generateDescription(editorData),
        tags: blog.tags || [],
        category: blog.category || "General",
        status: "published",
        publishedAt: new Date().toISOString(),
        author: user.email,
      };

      const response = await axios.post(import.meta.env.VITE_API_BLOG, blogData);
console.log("API URL:", import.meta.env.VITE_API_BLOG);

      if (response.data?.success) {
        setBlog({ ...blog, ...blogData, _id: response.data.blog._id });
        setEditorState("publish");
        toast.success("Published! 🚀", { id: toastId });
      } else {
        throw new Error(response.data?.message || "Publishing failed");
      }
    } catch (err) {
      console.error("Publish Error:", err);
      toast.error(err.message || "Error publishing blog", { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDraft = async () => {
    if (!title.trim().length) {
      return toast.error("Write a blog title to save draft.");
    }

    const toastId = toast.loading("Saving draft...");
    try {
      const editorData = editorReady && textEditor ? await textEditor.save() : { blocks: [] };

      const user = JSON.parse(localStorage.getItem("userData") || "{}");
      const draftData = {
        title: title.trim(),
        banner: bannerImage !== blogBanner ? bannerImage : null,
        content: editorData,
        description: generateDescription(editorData),
        tags: blog.tags || [],
        category: blog.category || "General",
        status: "draft",
        lastModified: new Date().toISOString(),
        author: user.email,
      };

      const response = await axios.post("/api/blogs/draft", draftData);

      if (response.data?.success) {
        setBlog({ ...blog, ...draftData, _id: response.data.blog._id });
        toast.success("Draft saved ✍️", { id: toastId });
      } else {
        throw new Error(response.data?.message || "Failed to save draft");
      }
    } catch (err) {
      console.error("Draft Error:", err);
      toast.error(err.message || "Error saving draft", { id: toastId });
    }
  };

  return (
    <>
      <nav className="z-10 sticky top-0 flex items-center gap-12 px-[5vw] py-5 h-[80px] border-b border-grey bg-white">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          <img src="https://img.icons8.com/clouds/100/b.png" alt="Logo" width="80" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button
            onClick={handlePublishEvent}
            disabled={!editorReady || isPublishing || uploading}
            className={`rounded-full py-2 px-6 text-xl ${
              editorReady && !isPublishing && !uploading
                ? "bg-black text-white hover:bg-opacity-80"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>
          <button
            onClick={handleDraft}
            disabled={uploading}
            className={`rounded-full py-2 px-6 text-xl ${
              !uploading ? "bg-[#eb5e28] text-white" : "bg-gray-400 text-white"
            }`}
          >
            Draft
          </button>
        </div>
      </nav>

      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full max-md:p-5">
            <div className="relative aspect-video hover:opacity-80 bg-white">
              <label htmlFor="uploadBanner" className="block w-full h-full cursor-pointer">
                <img
                  src={bannerImage}
                  alt="Blog banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = blogBanner;
                  }}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  hidden
                  accept=".png, .jpg, .jpeg"
                  onChange={handleBannerUpload}
                  ref={bannerInputRef}
                />
              </label>

              <textarea
                value={title}
                onChange={handleTitleChange}
                onKeyDown={(e) => e.keyCode === 13 && e.preventDefault()}
                placeholder="Blog Title"
                className="text-4xl font-bold w-full mt-5 outline-none placeholder-gray-400 text-black resize-none leading-tight"
              />

              <hr className="my-5 opacity-70" />
              <div id="textEditor" className="editorjs" />
            </div>
          </div>
        </section>
        {showPublishForm && <PublishForm />}
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;


// import { useState, useRef, useContext, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import AnimationWrapper from "@/common/page-animation";
// import blogBanner from "./Assets/blogBanner.png";
// import { EditorContext } from "../components/editor.pages";
// import toast, { Toaster } from "react-hot-toast";
// import EditorJS from "@editorjs/editorjs";
// import { tools } from "./Tools.components";
// import { uploadImageToCloudinaryRemote } from "./helper/uploadImage";
// import PublishForm from "./publish-from.component";

// // Configure axios defaults
// axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
// axios.defaults.timeout = 30000; // 30 seconds timeout

// // Add request interceptor for authentication
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// const BlogEditor = () => {
//   const {
//     blog,
//     blog: { title = "", banner = "", content = {} },
//     setBlog,
//     textEditor,
//     setTextEditor,
//     setEditorState,
//   } = useContext(EditorContext);

//   const navigate = useNavigate();
//   const bannerInputRef = useRef(null);

//   const [editorReady, setEditorReady] = useState(false);
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [error, setError] = useState(null);
//   const [bannerImage, setBannerImage] = useState(banner || blogBanner);
//   const [showPublishForm, setShowPublishForm] = useState(false);
//   const [isPublishing, setIsPublishing] = useState(false);

//   // Initialize EditorJS
//   useEffect(() => {
//     const editor = new EditorJS({
//       holderId: "textEditor",
//       data: content,
//       tools: tools,
//       placeholder: "Let's write awesome text",
//       onReady: () => {
//         setTextEditor(editor);
//         setEditorReady(true);
//       },
//     });

//     return () => {
//       editor.isReady
//         .then(() => editor.destroy())
//         .catch((e) => console.warn("Editor cleanup failed:", e));
//     };
//   }, []);

//   // Upload banner
//   const handleBannerUpload = (e) => {
//     const img = e.target.files[0];

//     if (img) {
//       let loadingToast = toast.loading("Uploading...");
//       const validTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (!validTypes.includes(img.type)) {
//         setError("Please select a valid image file (PNG, JPG, JPEG)");
//         toast.dismiss(loadingToast);
//         return;
//       }

//       if (img.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         toast.dismiss(loadingToast);
//         return;
//       }

//       setFile(img);
//       setError(null);

//       const reader = new FileReader();
//       reader.onload = () => {
//         setBannerImage(reader.result);
//       };
//       reader.readAsDataURL(img);

//       uploadImageToCloudinary(img, loadingToast);
//     }
//   };

//   const uploadImageToCloudinary = async (imageFile, toastId = null) => {
//     setUploading(true);
//     setError(null);

//     try {
//       const result = await uploadImageToCloudinaryRemote(imageFile);
//       if (!result) throw new Error("Upload failed");

//       const response = await axios.post(
//         import.meta.env.VITE_SERVER_UPLOAD || "/api/upload",
//         result
//       );

//       if (response.data?.url) {
//         setUploadedImage(response.data);
//         setBannerImage(response.data.url);
//         setBlog({ ...blog, banner: response.data.url });
//         if (toastId) toast.success("Uploaded Successfully 😁", { id: toastId });
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       setError("Error uploading image. Please try again.");
//       if (toastId) toast.error("Upload failed 😢", { id: toastId });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleTitleDown = (e) => {
//     if (e.keyCode === 13) e.preventDefault();
//   };

//   const handleTitleChange = (e) => {
//     let input = e.target;
//     input.style.height = "auto";
//     input.style.height = input.scrollHeight + "px";
//     setBlog({ ...blog, title: input.value });
//   };

//   // Enhanced publish function with proper backend integration
//   const handlePublishEvent = async () => {
//     // Validation checks
//     if (!bannerImage || bannerImage === blogBanner) {
//       return toast.error("Upload a Blog banner to publish it.");
//     }

//     if (!title.trim().length) {
//       return toast.error("Write a blog title to publish it.");
//     }

//     if (!textEditor || !editorReady) {
//       return toast.error("Editor not ready yet.");
//     }

//     setIsPublishing(true);
//     const toastId = toast.loading("Publishing your blog...");

//     try {
//       // Wait for editor to be ready and get content
//       await textEditor.isReady;
//       const editorData = await textEditor.save();

//       if (!editorData.blocks.length) {
//         toast.error("Write something in your blog to publish 🫥", {
//           id: toastId,
//         });
//         return;
//       }

//       // Upload banner image if not already uploaded
//       let finalBannerUrl = bannerImage;
//       if (file && !uploadedImage) {
//         try {
//           await uploadImageToCloudinary(file);
//           finalBannerUrl = uploadedImage?.url || bannerImage;
//         } catch (uploadError) {
//           console.error("Banner upload failed:", uploadError);
//           toast.error("Failed to upload banner image", { id: toastId });
//           return;
//         }
//       }

//       // Prepare blog data for backend
//       const blogData = {
//         title: title.trim(),
//         banner: finalBannerUrl,
//         content: editorData,
//         description: generateDescription(editorData), // Generate description from content
//         tags: blog.tags || [],
//         category: blog.category || "General",
//         status: "published",
//         publishedAt: new Date().toISOString(),
//         author: blog.author || getUserInfo(), // Get author info
//       };

//       // Send data to backend
//       const response = await axios.post(
//         import.meta.env.VITE_API_BLOG,
//         blogData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data && response.data.success) {
//         // Update blog state with response data
//         setBlog({
//           ...blog,
//           ...blogData,
//           _id: response.data.blog._id,
//           slug: response.data.blog.slug,
//         });

//         setEditorState("publish");
//         toast.success("Blog published successfully 🚀", { id: toastId });

//         // Navigate to the
//       } else {
//         throw new Error(response.data?.message || "Failed to publish blog");
//       }
//     } catch (error) {
//       console.error("Publish error:", error);

//       // Handle different types of errors
//       if (error.response) {
//         // Server responded with error status
//         const errorMessage =
//           error.response.data?.message ||
//           error.response.data?.error ||
//           `Server error: ${error.response.status}`;
//         toast.error(errorMessage, { id: toastId });
//       } else if (error.request) {
//         // Request was made but no response received
//         toast.error("Network error. Please check your connection.", {
//           id: toastId,
//         });
//       } else {
//         // Something else happened
//         toast.error(error.message || "Failed to publish blog", { id: toastId });
//       }
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // Enhanced draft save function
//   const handleDraft = async () => {
//     if (!title.trim().length) {
//       return toast.error("Write a blog title to save as draft.");
//     }

//     const toastId = toast.loading("Saving draft...");

//     try {
//       let editorData = { blocks: [] };

//       if (textEditor && editorReady) {
//         await textEditor.isReady;
//         editorData = await textEditor.save();
//       }

//       const draftData = {
//         title: title.trim(),
//         banner: bannerImage !== blogBanner ? bannerImage : null,
//         content: editorData,
//         description: generateDescription(editorData),
//         tags: blog.tags || [],
//         category: blog.category || "General",
//         status: "draft",
//         lastModified: new Date().toISOString(),
//         author: blog.author || getUserInfo(),
//       };

//       const response = await axios.post("/api/blogs/draft", draftData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.data && response.data.success) {
//         setBlog({
//           ...blog,
//           ...draftData,
//           _id: response.data.blog._id,
//         });
//         toast.success("Blog saved as draft ✍️", { id: toastId });
//       } else {
//         throw new Error(response.data?.message || "Failed to save draft");
//       }
//     } catch (error) {
//       console.error("Draft save error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to save draft";
//       toast.error(errorMessage, { id: toastId });
//     }
//   };

//   // Helper function to generate description from editor content
//   const generateDescription = (editorData) => {
//     if (!editorData || !editorData.blocks || !editorData.blocks.length) {
//       return "";
//     }

//     // Extract text from first paragraph block
//     const firstTextBlock = editorData.blocks.find(
//       (block) => block.type === "paragraph" && block.data.text
//     );

//     if (firstTextBlock) {
//       // Remove HTML tags and get first 150 characters
//       const plainText = firstTextBlock.data.text.replace(/<[^>]*>/g, "");
//       return (
//         plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "")
//       );
//     }

//     return "";
//   };

//   // Helper function to get user info (you might get this from context or localStorage)
//   const getUserInfo = () => {
//     // This should be replaced with actual user data from your auth system
//     const userData = JSON.parse(localStorage.getItem("userData") || "{}");
//     return {
//       id: userData.id || "anonymous",
//       name: userData.name || "Anonymous",
//       email: userData.email || "",
//       avatar: userData.avatar || "",
//     };
//   };

//   return (
//     <>
//       <nav className="z-10 sticky top-0 flex items-center gap-12 w-full px-[5vw] py-5 h-[80px] border-b border-grey bg-white">
//         <Link
//           to="/"
//           className="text-2xl font-bold text-gray-800 flex-none dark:text-white"
//         >
//           <img
//             width="80"
//             height="80"
//             src="https://img.icons8.com/clouds/100/b.png"
//             alt="Logo"
//           />
//         </Link>
//         <p className="max-md:hidden text-black line-clamp-1 w-full">
//           {title.length ? title : "New Blog"}
//         </p>
//         <div className="flex gap-4 ml-auto">
//           <button
//             onClick={handlePublishEvent}
//             disabled={!editorReady || isPublishing || uploading}
//             className={`whitespace-nowrap rounded-full py-2 px-6 text-xl capitalize transition-all duration-200 ${
//               editorReady && !isPublishing && !uploading
//                 ? "bg-black text-white hover:bg-opacity-80"
//                 : "bg-gray-400 text-white cursor-not-allowed"
//             }`}
//           >
//             {isPublishing ? "Posting..." : "Post"}
//           </button>
//           <button
//             onClick={handleDraft}
//             disabled={uploading}
//             className={`whitespace-nowrap rounded-full py-2 px-6 text-xl capitalize transition-all duration-200 ${
//               !uploading
//                 ? "hover:bg-opacity-80 bg-[#eb5e28] text-white"
//                 : "bg-gray-400 text-white cursor-not-allowed"
//             }`}
//             title="Save to Draft"
//           >
//             Draft
//           </button>
//         </div>
//       </nav>
//       <Toaster />
//       <AnimationWrapper>
//         <section>
//           <div className="mx-auto max-w-[900px] w-full max-md:p-5">
//             <div className="relative aspect-video hover:opacity-80 bg-white">
//               <label
//                 htmlFor="uploadBanner"
//                 className="cursor-pointer block w-full h-full"
//               >
//                 <img
//                   src={bannerImage}
//                   className="z-20 w-full h-full object-cover"
//                   alt="Blog banner"
//                   onError={(e) => {
//                     e.target.src = blogBanner;
//                   }}
//                 />
//                 <input
//                   id="uploadBanner"
//                   ref={bannerInputRef}
//                   type="file"
//                   accept=".png, .jpg, .jpeg"
//                   hidden
//                   onChange={handleBannerUpload}
//                 />
//               </label>

//               <textarea
//                 value={title}
//                 onKeyDown={handleTitleDown}
//                 onChange={handleTitleChange}
//                 placeholder="Blog Title"
//                 className="text-4xl font-bold w-full outline-none mt-5 placeholder-gray-400 text-black leading-tight resize-none"
//               />
//               <hr className="w-full opacity-70 my-5" />
//               <section>
//                 <div id="textEditor" className="editorjs"></div>
//               </section>
//             </div>
//           </div>
//         </section>
//         {showPublishForm && <PublishForm />}
//       </AnimationWrapper>
//     </>
//   );
// };

// export default BlogEditor;
