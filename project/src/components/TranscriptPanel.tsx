import React, { useState, useEffect, useMemo, useRef } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { useHMSStore, selectBroadcastMessages } from '@100mslive/react-sdk';
import { useAVToggle } from '@100mslive/react-sdk';

interface TranscriptItem {
  id: number;
  text: string;
  timestamp: string;
  speaker: 'Host' | 'User';
}

interface TranscriptPanelProps {
  isRoomCreator?: boolean;
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ isRoomCreator = false }) => {
  const { transcript, listening } = useSpeechRecognition(isRoomCreator);
  const [transcriptHistory, setTranscriptHistory] = useState<TranscriptItem[]>([]);
  const [simulatedMessages, setSimulatedMessages] = useState<TranscriptItem[]>([]);
  const [currentTypingMessage, setCurrentTypingMessage] = useState<{text: string, speaker: 'Host' | 'User', fullText: string} | null>(null);
  const broadcastMessages = useHMSStore(selectBroadcastMessages);
  const { isLocalAudioEnabled, toggleAudio } = useAVToggle();
  const processedMessageIds = useRef(new Set<string>());
  const simulationStarted = useRef(false);

  // Hard-coded dialogue
  const predefinedDialogue = [
    { speaker: 'Host' as const, text: 'hello leela prasad', delay: 1000 },
    { speaker: 'User' as const, text: 'hello sir', delay: 2000 },
    { speaker: 'Host' as const, text: 'which company has the highest networth in the last year..?', delay: 3000 },
    { speaker: 'User' as const, text: 'sir jet airways over 995 million dollars..', delay: 2500 }
  ];

  // Simulate typing effect
  const typeMessage = (fullText: string, speaker: 'Host' | 'User') => {
    setCurrentTypingMessage({ text: '', speaker, fullText });
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setCurrentTypingMessage(prev => prev ? {
          ...prev,
          text: fullText.substring(0, currentIndex + 1)
        } : null);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Add complete message to history
        const newMessage: TranscriptItem = {
          id: Date.now() + Math.random(),
          text: fullText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          speaker
        };
        setSimulatedMessages(prev => [...prev, newMessage]);
        setCurrentTypingMessage(null);
      }
    }, 50); // Typing speed
  };

  // Start simulation
  useEffect(() => {
    if (!simulationStarted.current) {
      simulationStarted.current = true;
      let totalDelay = 0;
      
      predefinedDialogue.forEach((dialogue, index) => {
        totalDelay += dialogue.delay;
        setTimeout(() => {
          typeMessage(dialogue.text, dialogue.speaker);
        }, totalDelay);
      });
    }
  }, []);

  useEffect(() => {
    if (isRoomCreator) {
      const newMessages = broadcastMessages.filter(
        msg => msg.type === 'transcript' && !processedMessageIds.current.has(msg.id)
      );
      if (newMessages.length > 0) {
        const newHistory = newMessages.map(msg => {
          processedMessageIds.current.add(msg.id);
          return JSON.parse(msg.message);
        });
        setTranscriptHistory(prev => [...prev, ...newHistory]);
      }
    }
  }, [broadcastMessages, isRoomCreator]);

  /**
   * Sends the transcript to the API endpoint.
   * @param query The transcript text to send.
   */
  const sendTranscript = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    const payload = { query };

    try {
      console.log('Sending payload:', payload);
      const response = await fetch('http://localhost:3000/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.text();
      console.log('Full response body:', responseBody);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = JSON.parse(responseBody);
      if (Array.isArray(data) && data.length > 0) {
        console.log('First item from API:', data[0]);
      } else {
        console.log('No data received from API');
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  useEffect(() => {
    if (transcript) {
      sendTranscript(transcript);
    }
  }, [transcript]);

  return (
    <div className={`transcript-panel bg-gray-800 text-white h-full flex relative w-72`}>
      <div className="flex flex-col h-full flex-1">
        <div className="p-3 border-b border-gray-700">
          <h3 className="font-semibold text-lg text-center">Live Conversation</h3>
          <div className="text-xs text-center text-gray-400 mt-1">
            <span className={`inline-flex items-center ${listening ? 'text-green-400' : 'text-red-400'}`}>
              <span className={`w-2 h-2 rounded-full mr-1 ${listening ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
              {listening ? 'Listening...' : 'Not Listening'}
            </span>
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <button
              onClick={toggleAudio}
              className={`px-3 py-1 text-xs rounded transition-all duration-200 ${
                isLocalAudioEnabled
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
              }`}>
              {isLocalAudioEnabled ? 'Mute Mic' : 'Unmute Mic'}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {/* Simulated conversation */}
          <div className="space-y-3">
            {simulatedMessages.map((item) => (
              <div key={item.id} className="py-2 px-3 rounded-lg hover:bg-gray-700/30 transition-colors">
                <div className="flex items-start gap-2 mb-1">
                  <span className={`font-medium text-xs px-2 py-1 rounded-full ${
                    item.speaker === 'Host'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {item.speaker}
                  </span>
                  <span className="text-xs text-gray-400">{item.timestamp}</span>
                </div>
                <p className="text-gray-100 ml-1 font-mono text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
            
            {/* Currently typing message */}
            {currentTypingMessage && (
              <div className="py-2 px-3 rounded-lg bg-gray-700/20 border-l-2 border-yellow-500">
                <div className="flex items-start gap-2 mb-1">
                  <span className={`font-medium text-xs px-2 py-1 rounded-full ${
                    currentTypingMessage.speaker === 'Host'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {currentTypingMessage.speaker}
                  </span>
                  <span className="text-xs text-yellow-400">typing...</span>
                </div>
                <p className="text-gray-100 ml-1 font-mono text-sm leading-relaxed">
                  {currentTypingMessage.text}
                  <span className="animate-pulse text-yellow-400">|</span>
                </p>
              </div>
            )}
          </div>
          
          {/* Live transcript */}
          {transcript && (
            <div className="mt-4 p-2 bg-gray-700/50 rounded border-l-2 border-green-500">
              <span className="text-green-400 font-medium">{isRoomCreator ? 'Host' : 'User'}:</span>
              <span className="ml-2 text-white font-mono">{transcript}</span>
            </div>
          )}
          
          {/* Broadcast messages */}
          <div className="space-y-1 mt-2">
            {useMemo(() =>
              transcriptHistory
                .sort((a, b) => a.id - b.id)
                .map((item) => (
                  <div key={item.id} className="py-1 px-2 rounded hover:bg-gray-700/30">
                    <div className="flex items-start gap-2">
                      <span className={`font-medium text-xs px-2 py-0.5 rounded-full ${
                        item.speaker === 'Host'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {item.speaker}
                      </span>
                      <span className="text-xs text-gray-400">{item.timestamp}</span>
                    </div>
                    <p className="text-gray-100 mt-1 font-mono text-sm leading-relaxed">{item.text}</p>
                  </div>
                )), [transcriptHistory])}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptPanel;