//importing tools
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Marker from "@editorjs/marker";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Quote from "@editorjs/quote";
// import BlogEditor from "./blog-editor.component";
import { uploadImageToCloudinaryRemote } from "../../src/components/helper/uploadImage";



const uploadImageByFile = async (file) => {
  try {
    const url = await uploadImageToCloudinaryRemote(file);
    if (url) {
      return { success: 1, file: { url } };
    }
    throw new Error("Image upload failed");
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: 0, message: error.message || "Image upload failed" };
  }
};

const uploadImageByUrl = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (error) {
      reject(error);
    }
  });
  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  marker: Marker,
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading....",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  inlinecode: InlineCode,
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  link: {
    class: LinkTool,
    config: {
      placeholder: "Paste your link here ...",
    },
  },
};
