import React, { useState } from "react";
import { menuLinks, assets } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } =
    useAppContext();

  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isHome = location.pathname === "/";

  return (
    <div
      className={`sticky top-0 z-40 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-borderColor transition-all ${
        isHome ? "bg-light" : "bg-white"
      }`}
    >
      <Link
        to="/"
        className="flex items-center gap-1.5 group"
        onClick={() => setOpen(false)}
      >
        <img
          src="/favicon.svg"
          alt="DrivRent logo"
          className="h-8 w-8 transition-transform duration-200 group-hover:scale-105"
        />
        <span className="text-2xl font-bold text-gray-700">DrivRent</span>
      </Link>

      {/* Backdrop for mobile menu */}
      {open && (
        <div
          className="sm:hidden fixed inset-0 top-16 bg-black/20 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex items-center gap-4 sm:gap-6">
        <div
          className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 max-sm:p-4 transition-transform duration-300 z-50 ${
            isHome ? "bg-light" : "bg-white"
          } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
        >
          {menuLinks.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={index}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`relative font-medium transition-colors ${
                  isActive ? "text-primary" : "text-gray-700 hover:text-primary"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="hidden sm:block absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}

          {/* Search bar - shown inside the mobile menu on small screens */}
          <div className="sm:hidden flex items-center text-sm border border-borderColor px-4 py-2 rounded-full w-full mt-2 focus-within:border-primary transition-colors">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none placeholder-gray-500"
              placeholder="Search cars"
            />
            <img
              src={assets.search_icon}
              alt=""
              aria-hidden="true"
              className="w-4 h-4 ml-2"
            />
          </div>

          <div className="sm:hidden flex flex-col gap-3 w-full mt-6 pt-4 border-t border-borderColor">
            <button
              onClick={() => {
                isOwner ? (navigate("/owner"), setOpen(false)) : changeRole();
              }}
              className="cursor-pointer py-2 text-left font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {isOwner ? "Dashboard" : "List cars"}
            </button>

            <button
              onClick={() => {
                user ? logout() : setShowLogin(true);
                setOpen(false);
              }}
              className="cursor-pointer px-8 py-2.5 bg-primary hover:bg-primary-dull transition-colors text-white font-medium rounded-lg w-full"
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>
        </div>

        {/* Search bar - desktop */}
        <div className="hidden lg:flex items-center text-sm border border-borderColor px-4 py-2 rounded-full w-64 focus-within:border-primary transition-colors">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder-gray-500"
            placeholder="Search cars"
          />
          <img
            src={assets.search_icon}
            alt=""
            aria-hidden="true"
            className="w-4 h-4 ml-2"
          />
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <button
            onClick={() => {
              isOwner ? navigate("/owner") : changeRole();
            }}
            className="cursor-pointer font-medium text-gray-700 hover:text-primary transition-colors"
          >
            {isOwner ? "Dashboard" : "List Cars"}
          </button>
          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-colors text-white font-medium rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      <button
        className="sm:hidden cursor-pointer z-50 relative"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <img
          src={open ? assets.close_icon : assets.menu_icon}
          alt=""
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default Navbar;
