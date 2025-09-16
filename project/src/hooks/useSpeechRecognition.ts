import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useHMSActions, useHMSStore, selectLocalPeer } from '@100mslive/react-sdk';
import { useAVToggle } from '@100mslive/react-sdk';

interface TranscriptItem {
  id: number;
  text: string;
  timestamp: string;
  speaker: 'Host' | 'User';
  senderId: string;
}

const useNewSpeechRecognition = (isRoomCreator: boolean) => {
  const { transcript, finalTranscript, listening, resetTranscript } = useSpeechRecognition();
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const { isLocalAudioEnabled } = useAVToggle();

  useEffect(() => {
    if (isLocalAudioEnabled) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isLocalAudioEnabled]);

  useEffect(() => {
    if (finalTranscript) {
      const newItem: TranscriptItem = {
        id: Date.now(),
        text: finalTranscript,
        timestamp: new Date().toLocaleTimeString(),
        speaker: isRoomCreator ? 'Host' : 'User',
        senderId: localPeer?.id || '',
      };
      hmsActions.sendBroadcastMessage(JSON.stringify(newItem), 'transcript');
      resetTranscript();
    }
  }, [finalTranscript, resetTranscript, isRoomCreator, hmsActions, localPeer?.id]);

  return { transcript, listening };
};

export default useNewSpeechRecognition;
