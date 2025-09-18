import React, { useState, useEffect, useRef } from "react";
import {
  LogOut,
  MapPin,
  Bus,
  Building2,
  User,
  Ticket,
  ChevronDown,
  CircleUserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Banner = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
   // Close dropdown when clicking outside
   useEffect(() => {
    const handleClickOutside = (event) => {
      console.log("Click outside detected, dropdown ref:", dropdownRef.current);
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log("Closing dropdown due to outside click");
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the token to get user role and email
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        setUserEmail(decodedToken.sub); // Assuming email is in the 'sub' claim
      } catch (error) {
        console.error("Invalid token", error);
        // Clear invalid token
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, [navigate]);
// Debug dropdown state changes
useEffect(() => {
  console.log("Dropdown state changed to:", isDropdownOpen);
}, [isDropdownOpen]);

const handleLogout = () => {
  try {
    // Clear the token
    localStorage.removeItem("token");
    
    // Reset user state
    setUserRole(null);
    setUserEmail(null);
    setIsDropdownOpen(false);
    
    // Navigate to login page
    navigate("/");
    
    // Optional: Force reload to clear any cached state
    setTimeout(() => {
      window.location.reload();
    }, 100);
    
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    // Fallback: force reload
    window.location.href = "/";
  }
};
const customerMenuItems = [
  // {
  //   label: "Profile",
  //   icon: <User className="mr-2 w-4 h-4" />,
  //   // onClick: () => navigate("/profile"),
  // },
];
const menuItems =
userRole === "ROLE_ADMIN"
  ? adminMenuItems
  : userRole === "ROLE_CUSTOMER"
  ? customerMenuItems
  : [];
  // Only show dropdown if there's a token
  const token = localStorage.getItem("token");
  const showDropdown = !!token;
  
  // Debug logging
  console.log("Header - Token exists:", !!token);
  console.log("Header - Token value:", token);
  console.log("Header - Show dropdown:", showDropdown);
  console.log("Header - User role:", userRole);
  console.log("Header - User email:", userEmail);
  console.log("Header - Dropdown open state:", isDropdownOpen);

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-x-hidden max-w-full">
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/50 to-transparent py-4 px-6 text-white">
      <nav className="container mx-auto flex justify-between items-center">
        <div
          className="text-2xl font-bold flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
         AI Expense Tracker
        </div>
        <ul className="flex space-x-6 items-center">
          {showDropdown && (
            <li ref={dropdownRef} className="relative">
              <div
                className="flex items-center hover:text-blue-300 transition-colors cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {userRole === "ROLE_ADMIN" ? (
                  "Admin"
                ) : (
                  <CircleUserRound className="size-7" />
                )}
                <ChevronDown className="ml-2 w-4 h-4" />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-black shadow-lg rounded-md overflow-hidden">
                  <div className="px-4 py-2 bg-gray-100 border-b">
                    <p className="text-sm font-medium truncate">{userEmail}</p>
                  </div>
                  {menuItems.map((item) => (
                    <div
                      key={item.label}
                      className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                      onClick={() => {
                        item.onClick();
                        setIsDropdownOpen(false);
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </div>
                  ))}
                  <div
                    className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer text-red-500 border-t"
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 w-4 h-4" />
                    Logout
                  </div>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>
    </header>
      <div className="container mx-auto px-6 py-20 text-center overflow-x-hidden max-w-full">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-3">Welcome to ExpenseAI</h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90" onClick={() => navigate("/")}>
          Track your spending and discover insights — no distractions.
        </p>
        
      </div>
    </div>
  );
};


// export default Header; // Removed to avoid conflict with named export

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerLinks = [
    { label: "Terms of Service", to: "/terms-of-service" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    // { label: "Contact Us", to: "/contact" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-6 px-6 overflow-x-hidden max-w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 overflow-x-hidden max-w-full">
        <div className="text-sm">
          &copy; {currentYear} AI Expense Tracker System. All Rights Reserved.
        </div>
        <div className="flex space-x-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              // href={link.href}
              to={link.to}
              className="hover:text-blue-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export { Banner, Footer };