import { useContext, useRef, useState } from "react";
import InputBox from "@/components/input.component";
import { MdAlternateEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "@/common/page-animation";
import axios from "axios";
import { BiUser } from "react-icons/bi";
import { toast, Toaster } from "react-hot-toast";
import { storeInSession } from "@/common/session";
import { UserContext } from "@/App";

const UserAuthForm = ({ type }) => {
  const authForm = useRef();

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);
  console.log(access_token);
  console.log(sessionStorage.getItem("user"));

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch((error) => {
        console.log("Axios error:", error);
        toast.error(error?.response?.data?.error || "Something went wrong");
      });
  };

  console.log(import.meta.env.VITE_SERVER_DOMAIN);

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleSubmitForm = (e) => {
    e.preventDefault();

    let serverRoute = type === "sign-in" ? "/signin" : "/signup";
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    //form data==>
    let form = new FormData(authForm.current);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    console.log(formData);
    //form validation
    let { fullname, email, password } = formData;
    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be at least 3 Letters Long");
      }
    }
    if (email.length < 3) {
      return toast.error("Enter Email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Passowrd should be 6 to 20 Characters Long With a Numeric , 1 Lowercase and 1 Uppercase Letters"
      );
    }
    userAuthThroughServer(serverRoute, formData);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-screen flex items-center justify-center">
        <Toaster />
        <form ref={authForm} className="w-[80%] max-w-[400px] bg-white p-6">
          <h1 className="join-us-today text-center text-3xl font-semibold mb-6">
            {type === "sign-in" ? "Welcome Back" : "Join Us Today"}
          </h1>

          {type !== "sign-in" && (
            <>
              <InputBox
                name="fullname"
                type="text"
                placeholder="Full Name"
                icon={<BiUser size={24} />}
                onChange={handleChange}
                value={formData.fullname}
              />
            </>
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon={<MdAlternateEmail size={24} />}
            onChange={handleChange}
            value={formData.email}
          />

          <div className="relative w-full mb-4">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-box w-full pl-12 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black font-semibold">
              <CiLock size={24} />
            </div>
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={togglePassword}
            >
              {showPassword ? (
                <IoEyeOffOutline size={24} className="text-black" />
              ) : (
                <IoEyeOutline size={24} className="text-black" />
              )}
            </div>
          </div>

          <button
            onClick={handleSubmitForm}
            type="submit"
            className="w-full bg-[#212121] hover:bg-[#454444] text-white py-2 rounded-lg mt-4 transition-colors duration-300"
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </button>

          <div className="relative w-full flex justify-center items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>OR</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button className="border border-black hover:bg-gray-100 px-3 py-3 rounded-xl flex items-center justify-center w-full gap-2">
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </button>

          {type === "sign-up" ? (
            <div className="flex justify-center items-center w-full">
              <p className="mt-6 text-dark-grey">
                Already a Member?
                <Link to="/signin" className="underline text-black ml-1">
                  Sign-In
                </Link>
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-center w-full">
              <p className="mt-6 text-dark-grey">
                Don't have an account?
                <Link to="/signup" className="underline text-black ml-1">
                  Sign-Up
                </Link>
              </p>
            </div>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
