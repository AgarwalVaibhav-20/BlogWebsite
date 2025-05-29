import { useState, useEffect, useContext, useRef } from "react";
import SearchBox from "./searchbar/SearchBox";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "@/App";
import { Bell } from "lucide-react";
import UserNavigationPanel from "./user-navigation.component";
import { Avatar } from "@lemonsqueezy/wedges";
const Header = () => {
  const {
    userAuth: { access_token, profilePhoto },
  } = useContext(UserContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserPanel, setShowUserPanel] = useState(false);

  const userPanelRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setIsMenuOpen(false);
  };

  // Hide navbar on scroll down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userPanelRef.current && !userPanelRef.current.contains(e.target)) {
        setShowUserPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBlur = () => {
    setTimeout(() => {
      setShowUserPanel(false);
    }, 200);
  };

  return (
    <>
      <nav
      // className={`transition-transform duration-300 ${
      //   showNavbar ? "translate-y-0" : "-translate-y-full"
      // } fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center w-full py-1 h-auto">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold text-gray-800 dark:text-white"
            >
              <img
                width="60"
                height="60"
                src="https://img.icons8.com/clouds/100/b.png"
                alt="Logo"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center w-full justify-between">
              <SearchBox />
              <ul className="flex items-center justify-center text-gray-700 dark:text-white space-x-4">
                <li className="hover:text-blue-600 cursor-pointer text-[18px] max-sm:hidden">
                  <Link to="/editor">Write</Link>
                </li>

                {access_token ? (
                  <>
                    <li>
                      <Link to="/dashboard/notification">
                        <button className="w-12 h-12 max-sm:hidden rounded-full flex justify-center items-center bg-gray-50 relative hover:bg-black/10">
                          <Bell size={20} />
                        </button>
                      </Link>
                    </li>
                    <li className="relative" ref={userPanelRef}>
                      <button
                        className="w-12 h-12 mt-1"
                        onBlur={handleBlur}
                        onClick={() => setShowUserPanel((prev) => !prev)}
                      >
                        <Avatar
                          alt="Max Quest"
                          size="3xl"
                          src={profilePhoto}
                          // src="https://images.unsplash.com/photo-1560800452-f2d475982b96?w=250&h=250&auto=format&fit=crop"
                        />
                        
                      </button>
                      {showUserPanel && <UserNavigationPanel />}
                    </li>
                  </>
                ) : (
                  <li className="hover:bg-[#403d39] cursor-pointer text-[18px] space-x-2 border p-2 rounded-xl bg-[#252422] text-white">
                    <Link to="/signin">Sign-in</Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Optional: Mobile Icons Here */}
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="mb-3 transition-all duration-300">
              <SearchBox />
            </div>
          )}
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Header;
