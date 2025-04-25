import PropTypes from "prop-types";
import { useState } from "react";
import { IoPersonAdd } from "react-icons/io5";

function NotificationSideBar({ notifications = [], markAllAsRead, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [count , setCount] = useState(0)
  const handleClose = () => {
    setIsVisible(false); // Trigger the animation
    setTimeout(onClose, 100); // Match the duration of the animation (300ms)
  };

  return (
    <>
      <div className="bg-[#f7fff7] min-h-40">
        <div
      className={` max-sm:w-full max-sm:justify-center max-sm:top-28  relative top-12 right-0 h-[500px] w-[300px] bg-[#f7fff7] shadow-lg p-5 transform transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
          {/* Close Button */}
          <button
          onClick={handleClose}
            className="text-xl absolute top-[-30px] right-4 text-black hover:text-gray-700 font-bold"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Header */}
          <header className="flex justify-between items-center w-full mb-5">
            <h1 className="text-lg font-bold">Notifications</h1>
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-500 underline hover:text-blue-700"
            >
              Mark All as Read
            </button>
          </header>

          {/* Notifications */}
          <section className="flex flex-col gap-4 w-full overflow-y-auto">
            <div className="flex justify-between items-center cursor-pointer">
              <div className="flex justify-center items-center gap-3">
              <p>Friend Request</p> <IoPersonAdd />
              </div>
              <div>{count}</div>
            </div>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className="p-3 bg-white shadow rounded-md">
                  {notification}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No notifications</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

NotificationSideBar.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.string),
  markAllAsRead: PropTypes.func,
  onClose: PropTypes.func.isRequired, // Added close button callback
};

export default NotificationSideBar;
