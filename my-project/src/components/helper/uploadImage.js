import axios from 'axios';

export const uploadImageToCloudinaryRemote = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'blog_image_uploads');

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    // You can return either just the secure URL or the whole response
    return response.data; // Contains secure_url, public_id, format, bytes, etc.
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};
