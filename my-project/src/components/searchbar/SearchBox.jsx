import { useState, useEffect, useRef, useCallback } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import axios from 'axios';

const SearchBox = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const [error, setError] = useState(null);
  const debounceTimeout = useRef(null);

  // Fetch users once when the component mounts
  useEffect(() => {
    const fetchUsers = async (searchTerm = "") => {
      try {
        const response = await axios.get("/search/searchbar", {
          params: { fullname: searchTerm, email: searchTerm,profilePhoto:searchTerm , page: 1, limit: 10 }
        });
    
        console.log("Fetched users:", response.data); // Debugging log
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };
    
    fetchUsers();
  }, []);
  
  

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search function to optimize filtering
  const handleSearch = useCallback((value) => {
    setInput(value);
    setIsOpen(true);
  
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  
    debounceTimeout.current = setTimeout(() => {
      if (value.trim() === "") {
        setResults([]);
        return;
      }
  
      // Ensure `users` is an array before filtering
      if (!Array.isArray(users)) {
        console.error("Users data is not an array:", users);
        setResults([]);
        return;
      }
  
      const filteredData = users.filter((user) =>
        user.fullname?.toLowerCase().includes(value.toLowerCase()) || // Ensure `user.name` exists
        user.email?.toLowerCase().includes(value.toLowerCase())   // Ensure `user.email` exists
      );
      setResults(filteredData);
    }, 300);
  }, [users]);
  

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault(); // Prevent form submission
        if (selectedIndex !== -1) {
          const selectedUser = results[selectedIndex];
          setInput(selectedUser.name);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    setInput("");
    setResults([]);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="flex items-center bg-white border w-full border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <div className="pl-3 text-gray-500">
          <CiSearch size={20} />
        </div>
        <input
          type="text"
          placeholder="Search users by name or email"
          value={input}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 outline-none text-gray-700 placeholder-gray-500"
          aria-label="Search users"
          aria-haspopup="listbox"
          role="combobox"
          aria-expanded={isOpen}
          onFocus={true}
        />
        {input && (
          <button 
            onClick={toggleSearch} 
            className="text-gray-600 hover:text-gray-700 transition-colors mr-3"
            aria-label="Clear search"
          >
            <IoMdClose size={20} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul 
        className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg"
        role="listbox"
      >
        {results.map((user, index) => (
          <li 
            key={user.id}
            role="option"
            aria-selected={selectedIndex === index}
            className={`p-3 cursor-pointer flex items-center gap-3 
              ${selectedIndex === index ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => {
              setInput(user.fullname);
              setIsOpen(false);
            }}
          >
            {/* Profile Image */}
            <img 
              src={user.profilePhoto} // Fallback image
              alt={user.fullname} 
              className="w-10 h-10 rounded-full object-cover border"
            />
            
            {/* User Details */}
            <div className="flex-1">
              <div className="font-medium text-gray-800">{user.fullname}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </li>
        ))}
      </ul>
      
      )}
    </div>
  );
};

export default SearchBox;
