import { useContext, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import InputBox from "@/components/input.component";
import { MdAlternateEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import AnimationWrapper from "@/common/page-animation";
import axios from "axios";
import { BiUser } from "react-icons/bi";
import { toast, Toaster } from "react-hot-toast";
import { storeInSession } from "@/common/session";
import { UserContext } from "@/App";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const UserAuthForm = ({ type }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const formDataObj = Object.fromEntries(form.entries());
    const { fullname, email, password } = formDataObj;

    if (type !== "sign-in" && fullname.length < 3) {
      return toast.error("Fullname must be at least 3 letters long");
    }
    if (!email || email.length < 3) {
      return toast.error("Enter Email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }
    if (!password.length) {
      return toast.error("Password cannot be empty");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and a special character"
      );
    }

    const serverRoute = type === "sign-in" ? "/signin" : "/signup";
    setLoading(true);

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formDataObj, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);

        toast.success(type === "sign-in" ? "Signed in successfully" : "Signed up successfully");
        navigate(type === "sign-in" ? "/" : "/authentication/verification");
      })
      .catch((error) => {
        console.error("Axios error:", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (access_token) return <Navigate to="/" />;

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-screen flex items-center justify-center">
        <Toaster />
        <form
          id="formElement"
          onSubmit={handleSubmitForm}
          className="w-[80%] max-w-[400px] bg-white p-6"
        >
          <h1 className="join-us-today text-center text-3xl font-semibold mb-6">
            {type === "sign-in" ? "Welcome Back" : "Join Us Today"}
          </h1>

          {type !== "sign-in" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon={<BiUser size={24} />}
              onChange={handleChange}
              value={formData.fullname}
            />
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
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-[#212121] hover:bg-[#454444]"
            } text-white py-2 rounded-lg mt-4 transition-colors duration-300`}
          >
            {loading
              ? type === "sign-in"
                ? "Signing In..."
                : "Signing Up..."
              : type === "sign-in"
              ? "Sign In"
              : "Sign Up"}
          </button>

          <div className="relative w-full flex justify-center items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>OR</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            type="button"
            className="border border-black hover:bg-gray-100 px-3 py-3 rounded-xl flex items-center justify-center w-full gap-2"
          >
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </button>

          <div className="flex justify-center items-center w-full">
            <p className="mt-6 text-dark-grey">
              {type === "sign-up" ? (
                <>
                  Already a Member?
                  <Link to="/signin" className="underline text-black ml-1">
                    Sign-In
                  </Link>
                </>
              ) : (
                <>
                  Don&apos;t have an account?
                  <Link to="/signup" className="underline text-black ml-1">
                    Sign-Up
                  </Link>
                </>
              )}
            </p>
          </div>
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
