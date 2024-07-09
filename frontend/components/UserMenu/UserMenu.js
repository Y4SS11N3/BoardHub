import React from 'react';
import { LuLayoutDashboard, LuSettings, LuLogOut } from "react-icons/lu";

const UserMenu = ({ user, onClose, onLogout }) => {
  return (
    <div className="w-64 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* User info section */}
      <div className="p-4 bg-orange-500">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white text-2xl font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <h3 className="text-white font-semibold">{user.name}</h3>
            <p className="text-orange-200 text-sm">{user.email}</p>
          </div>
        </div>
      </div>
      
      {/* Menu options */}
      <div className="p-2">
        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-150 flex items-center">
          <LuLayoutDashboard className="mr-3 text-gray-500" />
          <span>Dashboard</span>
        </button>
        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-150 flex items-center">
          <LuSettings className="mr-3 text-gray-500" />
          <span>User settings</span>
        </button>
        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-150 flex items-center">
          <span className="mr-3 text-gray-500">?</span>
          <span>Help and feedback</span>
        </button>
      </div>
      
      {/* Logout button */}
      <div className="px-2 pb-2">
        <button
          onClick={onLogout}
          className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition-colors duration-150 flex items-center justify-center"
        >
          <LuLogOut className="mr-2" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;