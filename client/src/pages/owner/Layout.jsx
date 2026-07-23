import React from "react";
import NavbarOwner from "../../components/owner/NavbarOwner";
import Sidebar from "../../components/owner/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-light">
      <NavbarOwner />
      <div className="flex flex-1 items-start">
        <div className="sticky top-[73px] self-start h-[calc(100vh-73px)]">
          <Sidebar />
        </div>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
