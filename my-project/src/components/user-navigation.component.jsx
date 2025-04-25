import AnimationWrapper from "@/common/page-animation";
import { Link } from "react-router-dom";
import { FaPen, FaUser, FaChartBar } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useContext } from "react";
import { UserContext } from "@/App";
import { removeFromSession } from "@/common/session";

const UserNavigationPanel = () => {
  const {
    userAuth: { username }, setUserAuth
  } = useContext(UserContext);

  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };

  const linkClasses = "flex items-center gap-2 pl-8 py-4 text-black hover:bg-gray-200 px-4";

  return (
    <AnimationWrapper
      className="absolute right-0 z-50"
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white absolute flex flex-col right-0 mt-1 border border-gray-500  rounded-lg w-64">
        <Link to="/editor" className={linkClasses}>
          <FaPen /> <span>Write</span>
        </Link>
        <Link to={`/user/${username}`} className={linkClasses}>
          <FaUser /> <span>Profile</span>
        </Link>
        <Link to="/dashboard/blogs" className={linkClasses}>
          <FaChartBar /> <span>Dashboard</span>
        </Link>
        <Link to="/settings/edit-profile" className={linkClasses}>
          <FiSettings /> <span>Settings</span>
        </Link>

        <span className="border-t border-gray-500 w-full "></span>

        <button
          className="flex items-start gap-2 hover:bg-gray-200 w-full pl-8 py-4 text-black text-left"
          onClick={signOutUser}
        >
          <FiLogOut size={20} className="mt-1" />
          <div>
            <h1 className="font-semibold text-xl mb-1">Sign Out</h1>
            <p className="text-black text-sm">@{username}</p>
          </div>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
