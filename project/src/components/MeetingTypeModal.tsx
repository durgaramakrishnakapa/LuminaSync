import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Code, 
  Phone,
  Video,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

interface MeetingTypeModalProps {
  onStart: (type: string) => void;
}

const MeetingTypeModal: React.FC<MeetingTypeModalProps> = ({ onStart }) => {
  const [selectedType, setSelectedType] = useState('');

  const meetingTypes = [
    {
      id: 'interview',
      title: 'Job Interview',
      description: 'Technical or behavioral interview with potential employers',
      icon: Briefcase,
      color: 'blue'
    },
    {
      id: 'client',
      title: 'Client Call',
      description: 'Business meeting with clients or stakeholders',
      icon: Phone,
      color: 'green'
    },
    {
      id: 'technical',
      title: 'Technical Meeting',
      description: 'Code review, architecture discussion, or technical planning',
      icon: Code,
      color: 'purple'
    },
    {
      id: 'team',
      title: 'Team Meeting',
      description: 'Internal team sync, standup, or collaborative session',
      icon: Users,
      color: 'orange'
    },
    {
      id: 'presentation',
      title: 'Presentation',
      description: 'Presenting to an audience or pitching ideas',
      icon: Video,
      color: 'red'
    },
    {
      id: 'consultation',
      title: 'Consultation',
      description: 'Advisory or consulting session with experts',
      icon: MessageCircle,
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: isSelected 
        ? 'border-blue-500 bg-blue-50 text-blue-700' 
        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50',
      green: isSelected 
        ? 'border-green-500 bg-green-50 text-green-700' 
        : 'border-gray-200 hover:border-green-300 hover:bg-green-50',
      purple: isSelected 
        ? 'border-purple-500 bg-purple-50 text-purple-700' 
        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50',
      orange: isSelected 
        ? 'border-orange-500 bg-orange-50 text-orange-700' 
        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50',
      red: isSelected 
        ? 'border-red-500 bg-red-50 text-red-700' 
        : 'border-gray-200 hover:border-red-300 hover:bg-red-50',
      indigo: isSelected 
        ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100',
      red: 'text-red-600 bg-red-100',
      indigo: 'text-indigo-600 bg-indigo-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Start Your Meeting</h1>
        <p className="text-lg text-gray-600">
          Select the type of meeting to begin
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {meetingTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${getColorClasses(type.color, isSelected)}`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getIconColorClasses(type.color)}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </button>
          );
        })}
      </div>

      {selectedType && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Ready to start your {meetingTypes.find(t => t.id === selectedType)?.title.toLowerCase()}?
              </h3>
              <p className="text-gray-600">
                You'll be prompted to enter a room code to join the meeting.
              </p>
            </div>
            <button
              onClick={() => onStart(selectedType)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingTypeModal;