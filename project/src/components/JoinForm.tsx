import React, { useState } from 'react';
import { useHMSActions } from "@100mslive/react-sdk";
import { Video, User, Mic, MicOff, VideoOff, Copy, Check, Loader2, Plus, LogIn } from 'lucide-react';

interface JoinFormProps {
  meetingType?: string;
  onJoin?: (roomCode: string, isRoomCreator: boolean) => void; // Add isRoomCreator parameter
  userName?: string; // Add userName prop to get name from login
}

const JoinForm: React.FC<JoinFormProps> = ({ meetingType, onJoin, userName }) => {
  const hmsActions = useHMSActions();
  const [inputValues, setInputValues] = useState({
    roomCode: "",
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomCodeCopied, setRoomCodeCopied] = useState(false);
  
  const FIXED_ROOM_CODE = "wml-aiox-vtq"; // Fixed room code for all meetings

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { roomCode = "" } = inputValues;
    const displayName = userName || "Anonymous"; // Use userName from props or fallback

    try {
      const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });
      await hmsActions.join({ 
        userName: displayName, 
        authToken,
        settings: {
          isAudioMuted: !isAudioEnabled,
          isVideoMuted: !isVideoEnabled
        }
      });
      
      // Notify parent component about the room code
      if (onJoin) {
        onJoin(roomCode, false); // false = user joined with existing code
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateRoom = async () => {
    setIsCreatingRoom(true);
    
    // Show creating animation for 2 seconds
    setTimeout(async () => {
      const displayName = userName || "Anonymous";

      try {
        const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode: FIXED_ROOM_CODE });
        await hmsActions.join({ 
          userName: displayName, 
          authToken,
          settings: {
            isAudioMuted: !isAudioEnabled,
            isVideoMuted: !isVideoEnabled
          }
        });
        
        if (onJoin) {
          onJoin(FIXED_ROOM_CODE, true); // true = user created the room
        }
      } catch (e) {
        console.error(e);
        setIsCreatingRoom(false);
      }
    }, 2000);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(FIXED_ROOM_CODE);
    setRoomCodeCopied(true);
    setTimeout(() => setRoomCodeCopied(false), 2000);
  };

  const meetingTypes = [
    {
      id: 'interview',
      title: 'Job Interview',
      description: 'Technical or behavioral interview with potential employers'
    },
    {
      id: 'client',
      title: 'Client Call',
      description: 'Business meeting with clients or stakeholders'
    },
    {
      id: 'technical',
      title: 'Technical Meeting',
      description: 'Code review, architecture discussion, or technical planning'
    },
    {
      id: 'team',
      title: 'Team Meeting',
      description: 'Internal team sync, standup, or collaborative session'
    },
    {
      id: 'presentation',
      title: 'Presentation',
      description: 'Presenting to an audience or pitching ideas'
    },
    {
      id: 'consultation',
      title: 'Consultation',
      description: 'Advisory or consulting session with experts'
    }
  ];

  const selectedMeetingType = meetingTypes.find(type => type.id === meetingType) || meetingTypes[0];

  // Show creating room animation
  if (isCreatingRoom) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Creating Room...</h2>
          <p className="text-gray-600 mb-6">Setting up your meeting space</p>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Room Code Generated:</p>
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 font-mono text-lg font-bold text-blue-600 tracking-wider">
                {FIXED_ROOM_CODE}
              </div>
              <button
                onClick={copyRoomCode}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
                title="Copy room code"
              >
                {roomCodeCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {roomCodeCopied && (
              <p className="text-sm text-green-600 mt-2 font-medium">✓ Copied to clipboard!</p>
            )}
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Connecting in a moment...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Video className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Join Meeting
        </h1>
        <p className="text-gray-600">Connect with your team instantly</p>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex items-center">
          <div className="mr-3">
            <Video className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800">{selectedMeetingType.title}</h3>
            <p className="text-sm text-blue-600">{selectedMeetingType.description}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        {/* Join Existing Room */}
        <div className="mb-4">
          <div className="flex space-x-3">
            <input
              type="text"
              name="roomCode"
              value={inputValues.roomCode}
              onChange={handleInputChange}
              placeholder="Enter existing room code"
              className="flex-1 px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <button 
              onClick={handleSubmit}
              disabled={!inputValues.roomCode.trim()}
              className={`px-6 py-4 rounded-xl font-semibold transition-all shadow-md ${
                inputValues.roomCode.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <LogIn className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500 bg-white font-medium">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>
        
        {/* Create New Room */}
        <button
          type="button"
          onClick={handleCreateRoom}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center space-x-3"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Room</span>
          <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-mono">
            {FIXED_ROOM_CODE}
          </span>
        </button>
      </div>

      {/* Audio/Video Controls */}
      <div className="mb-6 flex justify-center space-x-6">
        <button
          type="button"
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          className={`p-4 rounded-xl flex flex-col items-center transition-all shadow-md ${
            isAudioEnabled 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          }`}
        >
          {isAudioEnabled ? <Mic className="w-6 h-6 mb-1" /> : <MicOff className="w-6 h-6 mb-1" />}
          <span className="text-xs font-medium">{isAudioEnabled ? 'Mute' : 'Unmute'}</span>
        </button>
        
        <button
          type="button"
          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
          className={`p-4 rounded-xl flex flex-col items-center transition-all shadow-md ${
            isVideoEnabled 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          }`}
        >
          {isVideoEnabled ? <Video className="w-6 h-6 mb-1" /> : <VideoOff className="w-6 h-6 mb-1" />}
          <span className="text-xs font-medium">{isVideoEnabled ? 'Show' : 'Hide'}</span>
        </button>
      </div>
    </div>
  );
};

export default JoinForm;