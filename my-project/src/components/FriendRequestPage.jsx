// import React from 'react'
import { BsCookie } from "react-icons/bs";
function FriendRequestPage() {
  return (
    <div className="flex justify-center items-center h-screen ">
   <section className="fixed max-w-2xl p-4 mx-auto bg-white border border-gray-200 md:gap-x-4 bottom-16 dark:bg-gray-900 md:flex md:items-center dark:border-gray-700 rounded-2xl flex justify-center items-center flex-col max-sm:items-center max-sm:w-[340px] max-sm:px-6">
    <div className="flex items-center gap-x-4">
        <span className="inline-flex p-2 text-slate-700 rounded-lg shrink-0 dark:bg-gray-800 bg-gray-100/80">
            <BsCookie/>
        </span>

        <p className="text-sm text-gray-600 dark:text-gray-300">We use cookies to ensure that we give you the best experience on our website. <a href="#" className="text-blue-500 hover:underline">Read cookies policies</a>. </p>
    </div>
    
    <div className="flex items-center mt-6 gap-x-4 shrink-0 lg:mt-0">
        <button className="w-1/2 text-xs text-gray-800 underline transition-colors duration-300 md:w-auto dark:text-white dark:hover:text-gray-400 hover:text-gray-600 focus:outline-none">
            Cookie Setting
        </button>

        <button className=" text-xs w-1/2 md:w-auto font-medium bg-gray-800 rounded-lg hover:bg-gray-700 text-white px-4 py-2.5 duration-300 transition-colors focus:outline-none">
            Accept All Cookies
        </button>
    </div>
</section>   
    </div>
  )
}

export default FriendRequestPage
