import { MdOutlineEmail } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { Eye } from "lucide-react";
import { useState } from "react";
import { EyeOff } from "lucide-react";

function Login() {
  const [seePassword, setSeePassword] = useState(false);

  const toggleEyeClick = () => {
    setSeePassword((prev) => !prev);
  };
  return (
    <div className="flex justify-center items-center  h-full sm:translate-y-20 ">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg max-sm:m-4 border">
        <h1 className="text-center text-2xl">Log-In</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <div className="flex items-center border rounded-md px-2">
              <MdOutlineEmail className="text-gray-500" />
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full border-none outline-none p-2"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="flex items-center border rounded-md px-2">
              <IoLockClosedOutline className="text-gray-500" />
              <input
                type={seePassword ? "text" : "password"} // Toggles input type based on seePassword
                id="password"
                placeholder="Password"
                className="w-full border-none outline-none p-2"
              />
              {seePassword ? (
                <Eye
                  className="text-gray-500 cursor-pointer text-lg"
                  onClick={toggleEyeClick}  size={20}
                />
              ) : (
                <EyeOff
                  className="text-gray-500 cursor-pointer text-lg"
                  size={20}
                  onClick={toggleEyeClick}
                />
              )}
            </div>
          </div>
          <button className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-900">
            Log in
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?
            <button className="text-blue-600 hover:underline">Sign-up</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
