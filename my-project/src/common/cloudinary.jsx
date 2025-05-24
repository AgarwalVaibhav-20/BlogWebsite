

// // components/CloudinaryUpload.jsx
// import { useState, useRef } from "react";
// import toast from "react-hot-toast";
// import axios from "axios";

// const CloudinaryUpload = ({ onUploadSuccess, initialImage }) => {
//   const [uploading, setUploading] = useState(false);
//   const [previewImage, setPreviewImage] = useState(initialImage);
//   const bannerInputRef = useRef();

//   const handleBannerUpload = (e) => {
//     const img = e.target.files[0];

//     if (img) {
//       let loadingToast = toast.loading("Uploading...");
//       const validTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (!validTypes.includes(img.type)) {
//         toast.dismiss(loadingToast);
//         return toast.error("Please select a valid image file (PNG, JPG, JPEG)");
//       }

//       if (img.size > 5 * 1024 * 1024) {
//         toast.dismiss(loadingToast);
//         return toast.error("Image size must be less than 5MB");
//       }

//       const reader = new FileReader();
//       reader.onload = () => setPreviewImage(reader.result);
//       reader.readAsDataURL(img);

//       uploadImageToCloudinary(img, loadingToast);
//     }
//   };

//   const uploadImageToCloudinary = async (imageFile, toastId) => {
//     setUploading(true);
//     const formData = new FormData();
//     formData.append("image", imageFile);

//     try {
//       const response = await axios.post(
//         import.meta.env.VITE_SERVER_UPLOAD,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       if (response.data && response.data.url) {
//         toast.success("Uploaded Successfully 😁", { id: toastId });
//         setPreviewImage(response.data.url);
//         onUploadSuccess(response.data.url);
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       toast.error("Upload failed 😢", { id: toastId });
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="relative aspect-video hover:opacity-80 bg-white">
//       <label htmlFor="uploadBanner" className="cursor-pointer block w-full h-full">
//         {uploading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-30">
//             <div className="loading-spinner text-xl font-bold text-gray-700 flex">
//               <span className="ml-2">Uploading</span>
//               <span className="ml-2 animate-bounce">.</span>
//               <span className="ml-2 animate-bounce [animation-delay:0.2s]">.</span>
//               <span className="ml-2 animate-bounce [animation-delay:0.4s]">.</span>
//             </div>
//           </div>
//         )}
//         <img
//           src={previewImage}
//           alt="Blog banner"
//           className="w-full h-full object-cover z-20"
//           onError={(e) => (e.target.src = initialImage)}
//         />
//         <input
//           id="uploadBanner"
//           ref={bannerInputRef}
//           type="file"
//           accept=".png, .jpg, .jpeg"
//           hidden
//           onChange={handleBannerUpload}
//         />
//       </label>
//     </div>
//   );
// };

// export default CloudinaryUpload;
