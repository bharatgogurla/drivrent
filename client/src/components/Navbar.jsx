import React, { useState } from "react";
import { menuLinks, assets } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { Car } from "lucide-react";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } =
    useAppContext();

  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const MotionLink = motion.create(Link);

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
    <motion.div
      initial={{
        opacity: 0,
        y: -25,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      className={`sticky top-0 z-40 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-borderColor transition-all ${
        isHome ? "bg-light" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <motion.div
          whileHover={{ y: -2, rotate: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-2 cursor-default"
        >
          <div className="w-12 h-10 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-blue-600/30">
            <Car className="text-white" size={28} strokeWidth={2.2} />
          </div>

          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-gray-700">DrivRent</span>
          </span>
        </motion.div>
      </div>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 sm:gap-6">
        <motion.div
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 22,
          }}
          className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 max-sm:p-4 transition-transform duration-300 z-50 ${
            isHome ? "bg-light" : "bg-white"
          } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
        >
          {menuLinks.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <MotionLink
                key={index}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`relative font-medium transition-colors ${
                  isActive ? "text-primary" : "text-gray-700 hover:text-primary"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}
              </MotionLink>
            );
          })}

          {/* Search bar - shown inside the mobile menu on small screens */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="sm:hidden flex items-center text-sm border border-borderColor px-4 py-2 rounded-full w-full mt-2 bg-white transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-md"
          >
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
          </motion.div>

          <div className="sm:hidden flex flex-col gap-3 w-full mt-6 pt-4 border-t border-borderColor">
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
        </motion.div>

        {/* Search bar - desktop */}
        <motion.div
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(0,0,0,.08)",
          }}
          className="hidden lg:flex items-center text-sm border border-borderColor px-4 py-2 rounded-full w-64 focus-within:border-primary transition-colors"
        >
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
        </motion.div>

        <div className="hidden sm:flex items-center gap-6">
          <motion.button
            onClick={() => {
              user ? logout() : setShowLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-primary transition-colors text-white font-medium rounded-lg"
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
            }}
          >
            {user ? "Logout" : "Login"}
          </motion.button>
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
    </motion.div>
  );
};

export default Navbar;
