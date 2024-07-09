import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  UserCircleIcon, LockClosedIcon, TrashIcon 
} from '@heroicons/react/24/outline';

// Define menu items for the settings sidebar
const menuItems = [
  { icon: UserCircleIcon, label: 'Info', path: '/settings/basic-info' },
  { icon: LockClosedIcon, label: 'Password', path: '/settings/change-password' },
  { icon: TrashIcon, label: 'Delete account', path: '/settings/delete-account' },
];

const SettingsSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 pt-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 px-4">Settings</h2>
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 mb-1 rounded-lg text-sm font-medium transition-colors duration-150 ${
              location.pathname === item.path
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsSidebar;