import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserContext } from '@/App';

const SearchBox = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);

  const navigate = useNavigate();
  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/search/searchbar", {
          params: { fullname: "", username: "", profilePhoto: "", page: 1, limit: 10 }
        });
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input search with authentication check
  const handleSearch = useCallback((value) => {
    if (!access_token) {
      toast.error("Please login to search users.");
      navigate("/signin");
      return;
    }

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

      if (!Array.isArray(users)) {
        setResults([]);
        return;
      }

      const filteredData = users.filter((user) =>
        user.fullname?.toLowerCase().includes(value.toLowerCase()) ||
        user.username?.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filteredData);
    }, 300);
  }, [users, access_token, navigate]);

  // Keyboard navigation
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
        e.preventDefault();
        if (selectedIndex !== -1) {
          const selectedUser = results[selectedIndex];
          setInput(selectedUser.username);
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
    setInput("");
    setIsOpen(false);
    setSelectedIndex(-1);
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
                setInput(user.username);
                setIsOpen(false);
              }}
            >
              <img 
                src={user.profilePhoto} 
                alt={user.fullname} 
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">{user.fullname}</div>
                <div className="text-sm text-gray-500">{user.username}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
