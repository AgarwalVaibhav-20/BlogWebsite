import { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AnimationWrapper from "@/common/page-animation";
import blogBanner from "./Assets/blogBanner.png";
import { EditorContext } from "../components/editor.pages";
import toast from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./Tools.components";
import { uploadImageToCloudinaryRemote } from "./helper/uploadImage";

const BlogEditor = () => {
  const {
    blog,
    blog: { title, banner, content, tags, des, author },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  const bannerInputRef = useRef(null);

  useEffect(() => {
    const editor = new EditorJS({
      holderId: "textEditor",
      data: "",
      tools: tools,
      placeholder: "Let's write awesome text",
    });

    setTextEditor(editor);

    return () => {
      editor.isReady
        .then(() => editor.destroy())
        .catch((e) => console.warn("Editor cleanup failed:", e));
    };
  }, []);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState(null);
  const [bannerImage, setBannerImage] = useState(banner || blogBanner);

  const handleBannerUpload = (e) => {
    const img = e.target.files[0];

    if (img) {
      let loadingToast = toast.loading("Uploading...");
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(img.type)) {
        setError("Please select a valid image file (PNG, JPG, JPEG)");
        toast.dismiss(loadingToast);
        return;
      }

      if (img.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        toast.dismiss(loadingToast);
        return;
      }

      setFile(img);
      setError(null);

      const reader = new FileReader();
      reader.onload = () => {
        setBannerImage(reader.result);
      };
      reader.readAsDataURL(img);

      uploadImageToCloudinary(img, loadingToast);
    }
  };

  const uploadImageToCloudinary = async (imageFile, toastId = null) => {
    setUploading(true);
    setError(null);

    try {
      const result  = await uploadImageToCloudinaryRemote(imageFile)
      if(!result){
        throw new Error("Something got wrong!");
      }
      const response = await axios.post(
        import.meta.env.VITE_SERVER_UPLOAD,
        result
      );

      if (response.data && response.data.url) {
        setUploadedImage(response.data);
        setBannerImage(response.data.url);
        setBlog({ ...blog, banner: response.data.url });
        if (toastId) toast.success("Uploaded Successfully 😁", { id: toastId });
      } else {
        throw new Error("Invalid response format");
      }
      
    } catch (err) {
      console.error("Upload error:", err);
      setError("Error uploading image. Please try again.");
      if (toastId) toast.error("Upload failed 😢", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleTitleDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  const handlePublishEvent = async () => {
    if (!bannerImage || bannerImage === blogBanner) {
      return toast.error("Upload a Blog banner to publish it.");
    }

    if (!title.trim().length) {
      return toast.error("Write a blog title to publish it.");
    }

    if (!textEditor) {
      return toast.error("Editor not ready yet.");
    }

    const isReady = await textEditor.isReady;
    if (isReady) {
      const data = await textEditor.save();
      if (!data.blocks.length) {
        return toast.error("Write something in your blog to publish 🫥");
      }

      setBlog({ ...blog, content: data });

      const toastId = toast.loading("Publishing your blog...");

      try {
        if (file && !uploadedImage) {
          await uploadImageToCloudinary(file);
        }

        // await axios.post('/api/save-blog', blog);

        setEditorState("publish");
        toast.success("Blog published successfully 🚀", { id: toastId });
      } catch (err) {
        console.error("Publish error:", err);
        toast.error("Failed to publish. Try again.", { id: toastId });
      }
    }
  };

  // const handlePublishEvent=(e)=>{
  //   console.log("object")
  //   if(!banner.length){
  //     return toast.error("Upload a blog banner to  post it")
  //   }
  // }
  const handleDraft = () => {
    toast.success("Blog saved as draft ✍️");
  };

  return (
    <>
      <nav className="z-10 sticky top-0 flex items-center gap-12 w-full px-[5vw] py-5 h-[80px] border-b border-grey bg-white">
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 flex-none dark:text-white"
        >
          <img
            width="80"
            height="80"
            src="https://img.icons8.com/clouds/100/b.png"
            alt="Logo"
          />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button
            onClick={handlePublishEvent}
            className="whitespace-nowrap bg-black text-white rounded-full py-2 px-6 text-xl capitalize hover:bg-opacity-80"
          >
            Publish
          </button>
          <button
            onClick={handleDraft}
            className="whitespace-nowrap rounded-full py-2 px-6 text-xl capitalize hover:bg-opacity-80 bg-[#eb5e28] text-white"
            title="Save to Draft"
          >
            Draft
          </button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full max-md:p-5">
            <div className="relative aspect-video hover:opacity-80 bg-white">
              <label
                htmlFor="uploadBanner"
                className="cursor-pointer block w-full h-full"
              >
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-30">
                    <div className="loading-spinner flex justify-center items-center text-2xl font-bold text-gray-700">
                      <p className="ml-2">Uploading</p>
                      <p className="ml-2 animate-bounce">.</p>
                      <p className="ml-2 animate-bounce [animation-delay:0.2s]">.</p>
                      <p className="ml-2 animate-bounce [animation-delay:0.4s]">.</p>
                      <p className="ml-2 animate-bounce [animation-delay:0.6s]">.</p>
                    </div>
                  </div>
                )}

                <img
                  src={bannerImage}
                  className="z-20 w-full h-full object-cover"
                  alt="Blog banner"
                  onError={(e) => {
                    e.target.src = blogBanner;
                  }}
                />

                <input
                  id="uploadBanner"
                  ref={bannerInputRef}
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>

              <textarea
                value={title}
                onKeyDown={handleTitleDown}
                onChange={handleTitleChange}
                placeholder="Blog Title"
                className="text-4xl font-bold w-full outline-none mt-5 placeholder-gray-400 text-black leading-tight resize-none"
              />
              <hr className="w-full opacity-70 my-5" />
              <section>
                <div id="textEditor" className="editorjs"></div>
              </section>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
