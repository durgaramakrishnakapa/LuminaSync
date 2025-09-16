import React from 'react';
import { 
  selectPeers, 
  useHMSStore,
  useAVToggle,
  useHMSActions
} from "@100mslive/react-sdk";
import Peer from "./Peer";
import TranscriptPanel from "./TranscriptPanel";
import ChatBot from "./ChatBot";
import { Phone, Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface ConferenceProps {
  userId: string;
  meetingType: string;
  roomCode: string;
  isRoomCreator?: boolean; // Add prop to identify if user created the room
}

const Conference: React.FC<ConferenceProps> = ({ userId: _userId, meetingType: _meetingType, roomCode: _roomCode, isRoomCreator = false }) => {
  const peers = useHMSStore(selectPeers);
  const { isLocalAudioEnabled, toggleAudio, isLocalVideoEnabled, toggleVideo } = useAVToggle();
  const hmsActions = useHMSActions();

  // Filter out duplicate peers
  const uniquePeers = peers.filter((peer, index, self) => 
    index === self.findIndex((p) => p.id === peer.id)
  );

  const handleLeave = async () => {
    try {
      await hmsActions.leave();
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  return (
    <div className="conference-section h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Main Content - Conditional Layout */}
      <div className="flex-1 flex min-h-0">
        {/* Show full interface for room creators */}
        {isRoomCreator ? (
          <>
            {/* Transcript Panel - Only for room creator */}
            <TranscriptPanel isRoomCreator={isRoomCreator} />
            
            {/* Video Area - Optimized for 2 people */}
            <div className="flex-1 p-4 flex items-center justify-center min-h-0">
              <div className="peers-container flex flex-col lg:flex-row gap-4 max-w-4xl w-full h-full max-h-[70vh]">
                {uniquePeers.slice(0, 2).map((peer: any) => (
                  <div key={peer.id} className="flex-1 h-full max-w-[400px] min-h-[280px]">
                    <Peer peer={peer} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* AI Assistant ChatBot */}
            <ChatBot />
          </>
        ) : (
          /* Simple interface for code joiners - only video */
          <div className="w-full p-6 flex items-center justify-center min-h-0">
            <div className="peers-container flex flex-col lg:flex-row gap-6 max-w-5xl w-full h-full max-h-[75vh]">
              {uniquePeers.slice(0, 2).map((peer: any) => (
                <div key={peer.id} className="flex-1 h-full min-h-[350px]">
                  <Peer peer={peer} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Control Bar - Fixed at bottom */}
      <div className="bg-gray-800 p-4 flex items-center justify-center space-x-6 border-t border-gray-700 flex-shrink-0">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full transition-colors shadow-lg ${
            isLocalAudioEnabled
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          title={isLocalAudioEnabled ? 'Mute' : 'Unmute'}
        >
          {isLocalAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-colors shadow-lg ${
            isLocalVideoEnabled
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          title={isLocalVideoEnabled ? 'Hide Camera' : 'Show Camera'}
        >
          {isLocalVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>
        
        <button
          onClick={handleLeave}
          className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors text-white shadow-lg"
          title="Leave Meeting"
        >
          <Phone className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Conference;