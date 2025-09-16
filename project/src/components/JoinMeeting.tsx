import React, { useState } from 'react';
import { 
  Video, 
  Mic, 
  Settings, 
  ArrowRight, 
  AlertCircle, 
  User, 
  MicOff, 
  VideoOff, 
  PhoneOff,
  Phone
} from 'lucide-react';
import { useHMSActions } from "@100mslive/react-sdk";

interface JoinMeetingProps {
  channelName: string;
  onBack?: () => void;
}

const JoinMeeting: React.FC<JoinMeetingProps> = ({ channelName, onBack }) => {
  const hmsActions = useHMSActions();
  const [userName, setUserName] = useState('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinMeeting = async () => {
    if (!userName.trim()) {
      setError('Please enter your name to join the meeting');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // In a real implementation with 100ms, we would join the room
      // For now, we'll just simulate the join process
      await new Promise(resolve => setTimeout(resolve, 800));
      setHasJoined(true);
    } catch (err) {
      setError('Failed to join meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveMeeting = () => {
    setHasJoined(false);
    if (onBack) {
      onBack();
    }
  };

  if (hasJoined) {
    // Show the 100ms meeting interface
    return (
      <div className="h-screen bg-gray-900 flex flex-col">
        {/* Meeting Header */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium">Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Meeting ID: {channelName}</span>
            </div>
          </div>

          <button
            onClick={handleLeaveMeeting}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Leave
          </button>
        </div>

        {/* 100ms Conference Component */}
        <div className="flex-1">
          {/* The Conference component will be rendered here in a real implementation */}
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white">
              <Phone className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-bold mb-2">Meeting in Progress</h2>
              <p className="text-gray-400 mb-6">Connected to 100ms video conference</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className={`p-3 rounded-full ${
                    isAudioEnabled 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`p-3 rounded-full ${
                    isVideoEnabled 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join Meeting</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Preview Section - Show real camera feed */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Preview</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className={`p-2 rounded-lg ${isAudioEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
                >
                  {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`p-2 rounded-lg ${isVideoEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
                >
                  {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="relative bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
              {isVideoEnabled ? (
                // Show camera preview
                <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Video className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-sm">Camera Preview</p>
                  </div>
                </div>
              ) : (
                // Show camera off state
                <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Video className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-sm">Camera Off</p>
                  </div>
                </div>
              )}
              
              {/* User name overlay */}
              {isVideoEnabled && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {userName ? userName : 'You'}
                </div>
              )}
            </div>
          </div>

          {/* Join Form */}
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Meeting Info */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-center text-sm text-blue-800">
                <Video className="w-4 h-4 mr-2" />
                <span>Meeting ID: {channelName}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Join Button */}
            <button
              onClick={handleJoinMeeting}
              disabled={isLoading || !userName.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  <span>Join Now</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Back Button */}
        {onBack && (
          <div className="text-center mt-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              ← Back to home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinMeeting;