import React, { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// MenuItem component
const MenuItem = ({ icon, text, onClick, isRed = false }) => (
  <div 
    className={`px-4 py-2.5 cursor-pointer hover:bg-gray-100 flex items-center`}
    onClick={onClick}
  >
    {React.cloneElement(icon, { className: `w-5 h-5 ${isRed ? 'text-red-500' : 'text-gray-500'}` })}
    <span className={`ml-3 text-sm ${isRed ? 'text-red-500' : 'text-gray-700'}`}>{text}</span>
  </div>
);

// FolderOptionsMenu component
const FolderOptionsMenu = ({ anchorEl, open, onClose, onRename, onDelete }) => {
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Calculate menu position when opened
  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const menuWidth = 192; // w-48 is 12rem, which is 192px
      const menuHeight = 80; // Approximate height of the menu

      let top = rect.bottom;
      let left = rect.left;

      if (left + menuWidth > window.innerWidth) {
        left = rect.right - menuWidth;
      }

      if (top + menuHeight > window.innerHeight) {
        top = rect.top - menuHeight;
      }

      setMenuPosition({ top, left });
    }
  }, [open, anchorEl]);

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[9999] bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div 
        className="fixed z-[10000] bg-white rounded-lg shadow-lg w-48 overflow-hidden"
        style={{
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          icon={<PencilIcon />}
          text="Rename folder"
          onClick={onRename}
        />
        <MenuItem
          icon={<TrashIcon />}
          text="Delete folder"
          onClick={onDelete}
          isRed={true}
        />
      </div>
    </>
  );
};

export default FolderOptionsMenu;