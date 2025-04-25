import { useEffect, useState } from "react";

function CookiesPage() {
  const [showCookiesPopup, setShowCookiesPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCookiesPopup(true);
    }, 500); // Show popup after 500ms

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  const handleAcceptCookies = () => {
    setShowCookiesPopup(false);
    console.log("Cookies accepted!");
  };

  const handleCookieSettings = () => {
    console.log("Redirecting to cookie settings...");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex justify-center items-center p-4">
      {showCookiesPopup && (
        <section className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 lg:bottom-12 lg:left-12 lg:right-12 
          bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 
          rounded-2xl shadow-lg w-auto max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center p-4 md:p-6 space-y-4 md:space-y-0 md:space-x-6">
            {/* Cookie Icon */}
            <div className="flex-shrink-0 flex justify-center md:justify-start w-full md:w-auto">
              <span className="inline-flex p-2 rounded-lg dark:bg-gray-800">
              <img width="50" height="50" src="https://img.icons8.com/plasticine/100/cookies.png" alt="cookies" />
              </span>
            </div>

            {/* Cookie Message */}
            <div className="text-center md:text-left flex-grow">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We use cookies to ensure that we give you the best experience on our website.{' '}
                <a href="#" className="text-blue-500 hover:underline">
                  Read cookie policies
                </a>
                .
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <button
                className="w-full md:w-auto text-xs text-gray-800 dark:text-white 
                  underline transition hover:text-gray-600 dark:hover:text-gray-400 
                  text-center"
                onClick={handleCookieSettings}
              >
                Cookie Settings
              </button>

              <button
                className="w-full md:w-auto text-xs font-medium 
                  bg-[#48BFD8] hover:bg-[#3ca4ba] text-white 
                  px-4 py-2.5 rounded-lg transition duration-300"
                onClick={handleAcceptCookies}
              >
                Accept All Cookies
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default CookiesPage;