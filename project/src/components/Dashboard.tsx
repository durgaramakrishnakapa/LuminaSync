import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import AboutSection from './AboutSection';
import UploadsSection from './UploadsSection';
import MeetingInterface from './MeetingInterface';
import PreviousMeetings from './PreviousMeetings';
import ProfileDropdown from './ProfileDropdown';
import { User } from '../App';
import { Menu } from 'lucide-react';

interface DashboardProps {
  user: User;
  userId: string;
}

export type ActiveSection = 'about' | 'uploads' | 'meeting' | 'previous';

const Dashboard: React.FC<DashboardProps> = ({ user, userId }) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('about');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [sidebarOpen]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'about':
        return <AboutSection />;
      case 'uploads':
        return <UploadsSection />;
      case 'meeting':
        return <MeetingInterface sidebarOpen={sidebarOpen} userId={userId} userName={user.name} />;
      case 'previous':
        return <PreviousMeetings />;
      default:
        return <AboutSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Overlay for mobile/tablet when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div ref={sidebarRef}>
        <Sidebar 
          isOpen={sidebarOpen}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
              )}
              <h1 className="text-2xl font-bold text-gray-800">LuminaSync</h1>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.profession}</p>
                </div>
              </button>
              
              {showProfile && (
                <ProfileDropdown 
                  user={user} 
                  onClose={() => setShowProfile(false)} 
                />
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={`flex-1 ${activeSection === 'meeting' ? '' : 'p-6'} ${activeSection === 'meeting' ? 'overflow-hidden' : ''}`}>
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;