import React, { useRef, useEffect } from 'react';
import { User as UserIcon, Settings, HelpCircle, LogOut } from 'lucide-react';
import { User } from '../App';

interface ProfileDropdownProps {
  user: User;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-600">{user.profession}</p>
          </div>
        </div>
      </div>

      <div className="py-2">
        <button className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <UserIcon className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">Profile Settings</span>
        </button>
        <button className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">Preferences</span>
        </button>
        <button className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors">
          <HelpCircle className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">Help & Support</span>
        </button>
      </div>

      <div className="border-t border-gray-200">
        <button className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-red-50 transition-colors text-red-600">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;