import React from "react";
import { motion } from "motion/react";
import { ownerMenuLinks } from "../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen md:flex flex-col items-center max-w-16 md:max-w-72 w-full border-r border-borderColor bg-white text-sm">
      <div className="w-full py-5 px-2 md:px-3 flex flex-col gap-1">
        {ownerMenuLinks.map((link, index) => {
          const active = link.path === location.pathname;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="relative"
            >
              <NavLink
                to={link.path}
                className={`flex items-center gap-3 w-full py-3 px-3 rounded-xl transition-colors ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-gray-500 hover:text-gray-700 hover:bg-light"
                }`}
              >
                <span
                  className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 transition-colors ${
                    active ? "bg-primary text-white" : "bg-light"
                  }`}
                >
                  <img
                    src={active ? link.coloredIcon : link.icon}
                    alt=""
                    className={`h-5 w-5 object-contain ${
                      active ? "brightness-0 invert" : ""
                    }`}
                  />
                </span>

                <span className="max-md:hidden flex-1 font-medium text-[15px]">
                  {link.name}
                </span>
              </NavLink>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
