import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HMSRoomProvider } from "@100mslive/react-sdk";
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import JoinMeeting from './components/JoinMeeting';

export interface User {
  name: string;
  profession: string;
}

// Main App Component with Router
function App() {
  return (
    <Router>
      <HMSRoomProvider>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/login" element={<AppContent />} />
          <Route path="/dashboard" element={<AppContent />} />
          <Route path="/join/:channelName" element={<AppContent />} />
        </Routes>
      </HMSRoomProvider>
    </Router>
  );
}

// App Content Component with State Management
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState<'splash' | 'login' | 'dashboard' | 'join'>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [joinChannelName, setJoinChannelName] = useState<string>('');

  useEffect(() => {
    // Handle routing based on current path
    const path = location.pathname;
    const joinMatch = path.match(/\/join\/(.+)/);
    
    if (joinMatch && joinMatch[1]) {
      setJoinChannelName(joinMatch[1]);
      setCurrentView('join');
      return;
    }
    
    if (path === '/login') {
      setCurrentView('login');
      return;
    }
    
    if (path === '/dashboard') {
      setCurrentView('dashboard');
      return;
    }
    
    // Default splash screen with auto-progression
    if (path === '/') {
      const timer = setTimeout(() => {
        if (currentView === 'splash') {
          navigate('/login');
          setCurrentView('login');
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location, navigate, currentView]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    navigate('/dashboard');
    setCurrentView('dashboard');
  };

  const handleBackFromJoin = () => {
    navigate('/login');
    setCurrentView('login');
    setJoinChannelName('');
  };

  if (currentView === 'join' && joinChannelName) {
    return (
      <JoinMeeting 
        channelName={joinChannelName} 
        onBack={handleBackFromJoin}
      />
    );
  }

  if (currentView === 'splash') {
    return <SplashScreen />;
  }

  if (currentView === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Generate a simple user ID based on name and timestamp
  const userId = user ? `${user.name.replace(/\s+/g, '_')}_${Date.now()}` : 'anonymous';

  return (
    <Dashboard user={user!} userId={userId} />
  );
}

export default App;