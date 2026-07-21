import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext';
import { motion } from 'motion/react';

const NavbarOwner = () => {

  const { user } = useAppContext();

  return (
    <div className="flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all">
      <motion.div 
       whileHover={{
          y: -2,
          rotate: -2,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
        }}
      className="flex items-center gap-2 cursor-default group">
        <img
          src="/favicon.svg"
          alt="DrivRent logo"
          className="h-8 w-8"
        />
        <span className="text-2xl font-bold text-gray-700 whitespace-nowrap">
          DrivRent
        </span>
      </motion.div>

      <p>Welcome, {user?.name || "owner"}</p>
    </div>
  )
}

export default NavbarOwner