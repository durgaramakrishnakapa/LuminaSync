import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Minimize2, GripVertical } from 'lucide-react'; // Removed unused 'X' import

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  image?: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI meeting assistant. I can help you with questions about your resume, projects, or provide suggestions during your meeting. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<{text: string, fullText: string, image?: string} | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [panelWidth, setPanelWidth] = useState(288);
  const [isResizing, setIsResizing] = useState(false);
  const streamingStarted = useRef(false);
  // Simulate streaming bot response
  const streamBotResponse = (fullText: string, image?: string) => {
    setStreamingMessage({ text: '', fullText, image });
    setIsTyping(true);
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setStreamingMessage(prev => prev ? {
          ...prev,
          text: fullText.substring(0, currentIndex + 1)
        } : null);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Add complete message to history
        const newMessage: Message = {
          id: Date.now().toString(),
          text: fullText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'bot',
          image
        };
        setMessages(prev => [...prev, newMessage]);
        setStreamingMessage(null);
        setIsTyping(false);
      }
    }, 30); // Faster typing speed for bot responses
  };

  // Start streaming the hardcoded response
  useEffect(() => {
    if (!streamingStarted.current) {
      streamingStarted.current = true;
      setTimeout(() => {
        streamBotResponse(
          'According to the host asked the networth for the jet airways has the highest that is 995 million dollars and the information related to this found in this image. These are the citations:',
          '/data.png'
        );
      }, 2000); // Start after 2 seconds
    }
  }, []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<{ x: number; width: number } | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect to RAG Agent for automatic suggestions
  // useEffect(() => {
  //   const connectToRAGAgent = () => {
  //     try {
  //       const ws = new WebSocket('ws://localhost:8003/ws/rag-agent');
        
  //       ws.onopen = () => {
  //         console.log('Connected to RAG Agent');
  //         setWsConnection(ws);
  //       };
        
  //       ws.onmessage = (event) => {
  //         const data = JSON.parse(event.data);
  //         console.log('RAG Agent message received:', data);
          
  //         if (data.type === 'rag_suggestions' && data.suggestions && data.suggestions.length > 0) {
  //           // Add RAG suggestions as a bot message
  //           const suggestionsText = `🤖 **Document-Based Suggestions:**\n\n${data.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n\n')}`;
            
  //           let finalMessage = suggestionsText;
  //           if (data.sources && data.sources.length > 0) {
  //             finalMessage += `\n\n📚 **Sources:**\n${data.sources.map((source: string) => `• ${source}`).join('\n')}`;
  //           }
            
  //           const newMessage: Message = {
  //             id: Date.now().toString(),
  //             text: finalMessage,
  //             sender: 'bot',
  //             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //           };
            
  //           setMessages(prev => [...prev, newMessage]);
  //         }
  //       };
        
  //       ws.onclose = () => {
  //         console.log('Disconnected from RAG Agent');
  //         setWsConnection(null);
  //         // Attempt to reconnect after 5 seconds
  //         setTimeout(connectToRAGAgent, 5000);
  //       };
        
  //       ws.onerror = (error) => {
  //         console.log('RAG Agent connection error:', error);
  //       };
        
  //     } catch (error) {
  //       console.log('Failed to connect to RAG Agent:', error);
  //       // Retry connection after 10 seconds
  //       setTimeout(connectToRAGAgent, 10000);
  //     }
  //   };
    
  //   connectToRAGAgent();
    
  //   return () => {
  //     if (wsConnection) {
  //       wsConnection.close();
  //     }
  //   };
  // }, []);

  // Handle mouse events for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeStartRef.current) return;
      
      const deltaX = resizeStartRef.current.x - e.clientX;
      const newWidth = Math.max(250, Math.min(500, resizeStartRef.current.width + deltaX));
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      width: panelWidth
    };
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      return 'I can help you recall key points from your resume. What specific aspect would you like me to highlight - your experience, skills, or recent projects?';
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
      return 'Tell me about the project you\'d like to discuss. I can help you structure your explanation or remind you of technical details.';
    }
    if (lowerMessage.includes('interview') || lowerMessage.includes('question')) {
      return 'For interview questions, remember to use the STAR method (Situation, Task, Action, Result). Would you like me to help you structure an answer?';
    }
    if (lowerMessage.includes('technical') || lowerMessage.includes('coding')) {
      return 'For technical discussions, focus on your problem-solving approach, the technologies you used, and the impact of your solution. What technical topic are you preparing for?';
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! I\'m here to assist you during your meeting. Feel free to ask me anything about your background, projects, or need suggestions for responses.';
    }
    if (lowerMessage.includes('help')) {
      return 'I can help you with:\n• Recalling resume details\n• Structuring project explanations\n• Interview question strategies\n• Technical discussion points\n• General meeting support\n\nWhat would you like assistance with?';
    }
    
    // Default responses
    const defaultResponses = [
      'That\'s an interesting point. Would you like me to help you elaborate on that topic?',
      'I understand. Can you provide more context so I can better assist you?',
      'Great question! Let me help you think through this systematically.',
      'Based on what you\'ve shared, here are some key points you might want to emphasize...',
      'That sounds important. Would you like me to help you structure your thoughts on this?'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    // Removed unused userQuery variable
    setInputMessage('');
    setIsTyping(true);

    // try {
    //   // Send message directly to simple chatbot API
    //   const response = await fetch('http://localhost:8002/api/chat', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ message: userQuery })
    //   });
      
    //   if (response.ok) {
    //     const data = await response.json();
        
    //     const botResponse: Message = {
    //       id: (Date.now() + 1).toString(),
    //       text: data.success ? data.response : 'Sorry, I encountered an error. Please try again.',
    //       sender: 'bot',
    //       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    //     };
    //     setMessages(prev => [...prev, botResponse]);
    //   } else {
    //     throw new Error('ChatBot API not available');
    //   }
    // } catch (error) {
    //   console.error('ChatBot error:', error);
      // Fallback to local bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'AI features are currently disabled.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    // }
    
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div 
      ref={panelRef}
      className={`chatbot-panel bg-gray-800 text-white h-full flex relative ${isPanelOpen ? '' : 'w-12'}`}
      style={isPanelOpen ? { width: `${panelWidth}px` } : {}}
    >
      {/* Resize Handle */}
      {isPanelOpen && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gray-600 hover:bg-blue-500 cursor-ew-resize z-10 flex items-center justify-center group"
          onMouseDown={handleResizeStart}
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-3 h-3 text-white" />
          </div>
        </div>
      )}
      {isPanelOpen ? (
        <div className="flex flex-col h-full flex-1 ml-1">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                AI Assistant
              </span>
              <Bot className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold">RAG Assistant</h3>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={togglePanel}
                className="text-gray-400 hover:text-white"
                title="Minimize panel"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Messages with custom scrollbar */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {message.sender === 'bot' ? (
                      <Bot className="w-4 h-4 text-blue-400" />
                    ) : (
                      <User className="w-4 h-4 text-blue-300" />
                    )}
                    <span className="text-xs text-gray-300">{message.timestamp}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap mb-2">{message.text}</p>
                  {message.image && (
                    <div className="mt-2">
                      <img 
                        src={message.image} 
                        alt="Data visualization" 
                        className="max-w-full h-auto rounded-lg border border-gray-600"
                        style={{ maxHeight: '300px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Currently streaming message */}
            {streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-700 text-gray-100 border-l-2 border-green-500">
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-green-400">typing...</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap mb-2">
                    {streamingMessage.text}
                    <span className="animate-pulse text-green-400">|</span>
                  </p>
                  {streamingMessage.image && streamingMessage.text === streamingMessage.fullText && (
                    <div className="mt-2">
                      <img 
                        src={streamingMessage.image} 
                        alt="Data visualization" 
                        className="max-w-full h-auto rounded-lg border border-gray-600"
                        style={{ maxHeight: '300px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Currently streaming message */}
            {streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-700 text-gray-100 border-l-2 border-green-500">
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-green-400">typing...</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap mb-2">
                    {streamingMessage.text}
                    <span className="animate-pulse text-green-400">|</span>
                  </p>
                  {streamingMessage.image && streamingMessage.text === streamingMessage.fullText && (
                    <div className="mt-2">
                      <img 
                        src={streamingMessage.image} 
                        alt="Data visualization" 
                        className="max-w-full h-auto rounded-lg border border-gray-600"
                        style={{ maxHeight: '300px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {isTyping && !streamingMessage && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-300">typing...</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder=""
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] max-h-[120px]"
                rows={3}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className={`p-2 rounded-lg transition-colors ${
                  inputMessage.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <button 
            onClick={togglePanel}
            className="text-gray-400 hover:text-white transform -rotate-90 mb-4"
            title="Expand AI Assistant"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <span className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap">AI Assistant</span>
        </div>
      )}
    </div>
  );
};

export default ChatBot;

// Add custom scrollbar styles to the global CSS or component
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #000000;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4B5563;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6B7280;
  }
  
  /* Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #4B5563 #000000;
  }
`;

if (!document.head.querySelector('[data-chatbot-styles]')) {
  style.setAttribute('data-chatbot-styles', 'true');
  document.head.appendChild(style);
}