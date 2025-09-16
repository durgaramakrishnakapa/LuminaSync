import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Settings,
  Users,
  Lightbulb,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface LiveMeetingProps {
  meetingType: string;
  sidebarOpen: boolean;
}

interface Suggestion {
  id: string;
  title: string;
  content: string;
  source: string;
  confidence: number;
  timestamp: string;
}

const LiveMeeting: React.FC<LiveMeetingProps> = ({ meetingType, sidebarOpen }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showTracking, setShowTracking] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock data for demonstration
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      title: 'React State Management Experience',
      content: 'In the E-commerce project, I implemented Redux Toolkit for global state management, handling cart operations, user authentication, and product filtering. The app served 10k+ users with optimal performance.',
      source: 'E-commerce_App.zip',
      confidence: 95,
      timestamp: '10:24 AM'
    },
    {
      id: '2',
      title: 'Recent React Hooks Implementation',
      content: 'Used custom hooks for data fetching, form validation, and local storage management. Created reusable hooks that reduced code duplication by 40% across components.',
      source: 'React_Project_Notes.md',
      confidence: 88,
      timestamp: '10:24 AM'
    }
  ]);

  const [meetingDuration, setMeetingDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopySuggestion = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const handleFeedback = (suggestionId: string, isPositive: boolean) => {
    console.log(`Feedback for ${suggestionId}: ${isPositive ? 'positive' : 'negative'}`);
    // Handle feedback to improve suggestions
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Meeting</span>
            <span className="text-sm text-gray-300">({formatDuration(meetingDuration)})</span>
          </div>
          <span className="text-sm text-gray-300 capitalize">
            {meetingType.replace('_', ' ')} Session
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowTracking(!showTracking)}
            className={`p-2 rounded-lg transition-colors ${
              showTracking 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {showTracking ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          <span className="text-sm text-gray-300">Toggle Tracking</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Meeting Info */}
        {showTracking && (
          <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-white font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Participants
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="p-3 rounded-lg bg-gray-700">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">Y</span>
                  </div>
                  <span className="text-white text-sm font-medium">You (Host)</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-gray-700">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">P1</span>
                  </div>
                  <span className="text-white text-sm font-medium">Participant 1</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center Panel - Video Meeting */}
        <div className={`flex-1 bg-gray-900 flex flex-col ${showTracking ? '' : 'max-w-none'}`}>
          {/* Video Area */}
          <div className="flex-1 relative flex items-center justify-center">
            <div className="relative w-full max-w-4xl aspect-video bg-gray-800 rounded-lg overflow-hidden">
              {/* Placeholder for video */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white text-2xl font-bold">You</span>
                  </div>
                  <p className="text-gray-400">Your video feed</p>
                </div>
              </div>
              
              {/* Meeting participant thumbnails */}
              <div className="absolute top-4 right-4 space-y-2">
                <div className="w-32 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="p-6 bg-gray-800">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${
                  isMuted 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
              </button>
              
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition-colors ${
                  !isVideoOn 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isVideoOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
              </button>
              
              <button className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors">
                <Phone className="w-6 h-6 text-white" />
              </button>
              
              <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                <Settings className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - AI Suggestions */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
            <h2 className="text-white font-semibold flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              AI Suggestions
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Real-time insights from your documents
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-800 text-sm">{suggestion.title}</h3>
                  <div className="flex items-center space-x-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      suggestion.confidence > 90 
                        ? 'bg-green-100 text-green-800'
                        : suggestion.confidence > 70
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {suggestion.confidence}%
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {suggestion.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    <span>{suggestion.source}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{suggestion.timestamp}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleCopySuggestion(suggestion.content)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleFeedback(suggestion.id, true)}
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(suggestion.id, false)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Listening for relevant context...</span>
              </div>
              <p>Suggestions update based on conversation topics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMeeting;