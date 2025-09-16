import React from 'react';
import { ActiveSection } from './Dashboard';
import { 
  Info, 
  Upload, 
  Video, 
  History, 
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  activeSection, 
  onSectionChange, 
  onToggle 
}) => {
  const menuItems = [
    { id: 'about' as ActiveSection, label: 'About', icon: Info },
    { id: 'uploads' as ActiveSection, label: 'Uploads', icon: Upload },
    { id: 'meeting' as ActiveSection, label: 'Meetings', icon: Video },
    { id: 'previous' as ActiveSection, label: 'Previous Meetings', icon: History },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transition-transform duration-300 ${      isOpen ? 'translate-x-0' : '-translate-x-full'
    } w-64`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-800">
            LuminaSync
          </h2>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => onSectionChange('meeting')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md"
          >
            <Video className="w-5 h-5" />
            <span>New Meeting</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;