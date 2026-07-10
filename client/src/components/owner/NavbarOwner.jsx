import React from 'react'
import { dummyUserData, assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const NavbarOwner = () => {

  const user = dummyUserData;

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
    <Link
            to="/"
            className="flex items-center gap-1.5 group"            
          >
            <img
              src="./favicon.svg"
              alt="DrivRent logo"
              className="h-8 w-8 transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-2xl font-bold text-gray-700">DrivRent</span>
          </Link>
    <p>Welcome, {user.name || "owner"}</p>
    </div>
  )
}

export default NavbarOwner