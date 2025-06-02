import { UserContext } from "@/App";
import { createContext, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import BlogEditor from "./blog-editor.component";
import PublishForm from "./publish-from.component";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: "",
};

export const EditorContext = createContext({});

const Editor = () => {
  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });

  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {
        access_token === null ? (
          <Navigate to="/signin" />
        ) : editorState == "editor" ? (
          <BlogEditor />
        ) : (
          <PublishForm />
        )
      }
    </EditorContext.Provider>
  );
};

export default Editor;
