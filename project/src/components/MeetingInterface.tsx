import React, { useState } from 'react';
import { 
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore
} from "@100mslive/react-sdk";
import MeetingTypeModal from './MeetingTypeModal';
import JoinForm from './JoinForm';
import Conference from './Conference';

interface MeetingInterfaceProps {
  sidebarOpen: boolean;
  userId: string;
  userName?: string; // Add userName prop
}

const MeetingInterface: React.FC<MeetingInterfaceProps> = ({ sidebarOpen, userId, userName }) => {
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [showModal, setShowModal] = useState(true); // Reverted back to true
  const [meetingType, setMeetingType] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string>(''); // Add roomCode state
  const [isRoomCreator, setIsRoomCreator] = useState<boolean>(false); // Track if user created the room
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();

  const handleStartMeeting = (type: string) => {
    setMeetingType(type);
    setShowModal(false);
    setMeetingStarted(true);
  };

  // Handle room code from JoinForm
  const handleJoinMeeting = (code: string, isCreator: boolean) => {
    setRoomCode(code);
    setIsRoomCreator(isCreator); // Set whether user created the room
  };

  // Clean up when component unmounts
  React.useEffect(() => {
    const handleUnload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
    
    window.onbeforeunload = handleUnload;
    
    return () => {
      window.onbeforeunload = null;
    };
  }, [hmsActions, isConnected]);

  if (showModal) {
    return <MeetingTypeModal onStart={handleStartMeeting} />;
  }

  if (meetingStarted) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col">
        {isConnected ? (
          <Conference 
            userId={userId} 
            meetingType={meetingType} 
            roomCode={roomCode}
            isRoomCreator={isRoomCreator} // Pass the isRoomCreator prop
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <JoinForm 
              meetingType={meetingType} 
              onJoin={handleJoinMeeting}
              userName={userName}
            />
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MeetingInterface;