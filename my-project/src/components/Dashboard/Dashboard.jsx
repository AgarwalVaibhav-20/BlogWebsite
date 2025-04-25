import { useState } from "react";
import { Menu, X, LogOut, Book, Bell, Pen, User, Lock } from "lucide-react";
import YourBlog from "./YourBlog";
import Notification from "./Notification";
import WriteBlog from "./WriteBlog";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";

const ProfileSection = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 1, name: "My Blogs", icon: <Book size={20} /> },
    { id: 2, name: "Notifications", icon: <Bell size={20} /> },
    { id: 3, name: "Write Blog", icon: <Pen size={20} /> },
    { id: 4, name: "Edit Profile", icon: <User size={20} /> },
    { id: 5, name: "Change Password", icon: <Lock size={20} /> },
    { id: 6, name: "Log Out", icon: <LogOut size={20} /> },
  ];

  const handleTabChange = (id) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:block
        `}
      >
        <div className="flex flex-col h-full p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Dashboard</h1>
          
          <nav className="flex-grow">
            <ul className="space-y-2">
              {tabs.slice(0, -1).map((tab) => (
                <li 
                  key={tab.id}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg cursor-pointer 
                    transition duration-200 ease-in-out
                    ${activeTab === tab.id 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'hover:bg-gray-100 text-gray-700'}
                  `}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.name}</span>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div 
            className="mt-auto mb-4 flex items-center space-x-3 p-3 rounded-lg 
            text-red-600 hover:bg-red-50 cursor-pointer"
            onClick={() => handleTabChange(6)}
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Log Out</span>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main 
        className={`
          flex-grow p-6 md:p-8 transition-all duration-300 
          ${isSidebarOpen ? 'md:ml-0' : ''}
          bg-gray-50 min-h-screen
        `}
      >
        <div className=" mx-auto  md:p-8">
          {activeTab === 1 && <YourBlog />}
          {activeTab === 2 && <Notification />}
          {activeTab === 3 && <WriteBlog />}
          {activeTab === 4 && <EditProfile />}
          {activeTab === 5 && <ChangePassword />}
          {activeTab === 6 && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <LogOut size={48} className="text-red-500" />
              <h2 className="text-xl font-semibold text-gray-700">Logging Out...</h2>
              <p className="text-gray-500">You will be redirected shortly</p>
            </div>
          )}
        </div>
      </main>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileSection;