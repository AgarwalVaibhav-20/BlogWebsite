import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import UserAuthForm from "./pages/userAuthForm.pages";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import { TailSpin } from "react-loader-spinner";
import Editor from "./components/editor.pages";
import '@/App.css'
import SearchPage from "./pages/search.page";
import HomePage from "./pages/home.page";
export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userInSession = lookInSession("user");

    const timer = setTimeout(() => {
      if (userInSession) {
        setUserAuth(JSON.parse(userInSession));
      } else {
        setUserAuth({ access_token: null });
      }
      setLoading(false);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <TailSpin
          visible={true}
          height="40"
          width="40"
          color="#212121"
          ariaLabel="tail-spin-loading"
        />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor/>}/>
        <Route path="/" element={<Header />}> 
        <Route index element={<HomePage/>} />
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="search/:query" element={<SearchPage/>}/> 
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
