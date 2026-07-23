import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Car } from "lucide-react";

const NavbarOwner = () => {
  const { user, logout, navigate } = useAppContext();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-40 relative bg-white/90 backdrop-blur-md border-b border-borderColor">
      <div className="flex items-center justify-between px-6 md:px-10 py-3.5">
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

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-full pl-2 pr-3 py-1.5 border border-transparent hover:border-borderColor hover:bg-light transition-colors"
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold overflow-hidden ring-2 ring-primary/15">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="hidden sm:flex flex-col items-start leading-tight">
              <p className="font-semibold text-sm text-gray-700">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">Owner</p>
            </div>

            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform motion-reduce:transition-none ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute right-0 mt-3 w-64 rounded-2xl border border-borderColor bg-white shadow-xl overflow-hidden z-50 origin-top-right"
              >
                <div className="flex items-center gap-3 px-4 py-3.5 bg-light border-b border-borderColor">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold overflow-hidden shrink-0">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="py-1.5">
                  <button
                    onClick={() => {
                      navigate("/owner/profile");
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-light transition-colors"
                  >
                    <span className="grid place-items-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      <User size={15} />
                    </span>
                    My Profile
                  </button>

                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <span className="grid place-items-center w-8 h-8 rounded-full bg-red-50 text-red-500">
                      <LogOut size={15} />
                    </span>
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NavbarOwner;
