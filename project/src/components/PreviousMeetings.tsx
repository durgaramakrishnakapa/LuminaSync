import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  Users,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Star,
  MoreVertical,
  Briefcase,
  Phone,
  Code,
  MessageCircle
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  type: 'interview' | 'client' | 'technical' | 'team' | 'presentation' | 'consultation';
  date: string;
  duration: string;
  participants: string[];
  summary: string;
  keyTopics: string[];
  documentsUsed: string[];
  rating: number;
  aiInsights: number;
}

const PreviousMeetings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | Meeting['type']>('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'rating'>('date');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Mock data for demonstration
  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Senior React Developer Interview - TechCorp',
      type: 'interview',
      date: '2025-01-15',
      duration: '45 min',
      participants: ['Sarah Johnson (Interviewer)', 'Mike Chen (Tech Lead)'],
      summary: 'Technical interview focusing on React ecosystem, state management, and system design. Discussed previous e-commerce project and demonstrated problem-solving skills.',
      keyTopics: ['React Hooks', 'Redux', 'System Design', 'E-commerce Architecture'],
      documentsUsed: ['John_Doe_Resume.pdf', 'E-commerce_App.zip', 'React_Project_Notes.md'],
      rating: 5,
      aiInsights: 12
    },
    {
      id: '2',
      title: 'Client Onboarding - Digital Marketing Agency',
      type: 'client',
      date: '2025-01-12',
      duration: '30 min',
      participants: ['Emma Wilson (Account Manager)', 'David Brown (Client)'],
      summary: 'Initial consultation for new digital marketing campaign. Discussed target audience, budget allocation, and project timeline. Client approved proposed strategy.',
      keyTopics: ['Marketing Strategy', 'Budget Planning', 'Timeline', 'ROI Metrics'],
      documentsUsed: ['Marketing_Proposal.pdf', 'Portfolio_Examples.pdf'],
      rating: 4,
      aiInsights: 8
    },
    {
      id: '3',
      title: 'Architecture Review - Mobile App Project',
      type: 'technical',
      date: '2025-01-10',
      duration: '60 min',
      participants: ['Alex Kumar (Senior Dev)', 'Lisa Park (Product Manager)', 'Tom Zhang (DevOps)'],
      summary: 'Comprehensive review of mobile application architecture. Addressed scalability concerns, security implementations, and performance optimizations.',
      keyTopics: ['Mobile Architecture', 'Scalability', 'Security', 'Performance'],
      documentsUsed: ['Architecture_Docs.pdf', 'Security_Guidelines.md', 'Performance_Benchmarks.xlsx'],
      rating: 5,
      aiInsights: 15
    }
  ];

  const getTypeIcon = (type: Meeting['type']) => {
    switch (type) {
      case 'interview': return Briefcase;
      case 'client': return Phone;
      case 'technical': return Code;
      case 'team': return Users;
      case 'presentation': return FileText;
      case 'consultation': return MessageCircle;
      default: return FileText;
    }
  };

  const getTypeColor = (type: Meeting['type']) => {
    switch (type) {
      case 'interview': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'team': return 'bg-orange-100 text-orange-800';
      case 'presentation': return 'bg-red-100 text-red-800';
      case 'consultation': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMeetings = meetings
    .filter(meeting => {
      const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meeting.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meeting.keyTopics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterType === 'all' || meeting.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'duration':
          return parseInt(b.duration) - parseInt(a.duration);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleViewDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (selectedMeeting) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Enhanced Back Button */}
          <button
            onClick={() => setSelectedMeeting(null)}
            className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200"
          >
            ← Back to meetings
          </button>

          {/* Enhanced Meeting Details */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-4">{selectedMeeting.title}</h1>
                  <div className="flex items-center space-x-6 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">{formatDate(selectedMeeting.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{selectedMeeting.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {renderStars(selectedMeeting.rating)}
                      </div>
                      <span className="font-medium">({selectedMeeting.rating}/5)</span>
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-2 text-sm font-bold rounded-xl capitalize bg-white/20 backdrop-blur border border-white/30`}>
                  {selectedMeeting.type}
                </span>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Enhanced Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Meeting Summary
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">{selectedMeeting.summary}</p>
              </div>

              {/* Enhanced Participants */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Participants ({selectedMeeting.participants.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedMeeting.participants.map((participant, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 text-gray-800 px-4 py-3 rounded-lg font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {participant}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Key Topics */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  Key Topics Discussed ({selectedMeeting.keyTopics.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedMeeting.keyTopics.map((topic, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 text-purple-800 px-4 py-3 rounded-lg font-semibold text-center hover:scale-105 transition-transform duration-200">
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Documents Used */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Documents Referenced ({selectedMeeting.documentsUsed.length})
                </h2>
                <div className="space-y-3">
                  {selectedMeeting.documentsUsed.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="text-gray-800 font-medium">{doc}</span>
                      </div>
                      <button className="text-orange-600 hover:text-orange-700 bg-orange-100 hover:bg-orange-200 p-2 rounded-lg transition-colors duration-200">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced AI Insights Stats */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">AI Performance Analytics</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  LuminaSync provided <span className="font-bold text-green-600 text-lg">{selectedMeeting.aiInsights} intelligent suggestions</span> during this meeting, 
                  helping you access relevant information from your knowledge base in real-time. This represents excellent AI engagement and knowledge utilization.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedMeeting.aiInsights}</div>
                    <div className="text-sm text-gray-600">AI Insights</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedMeeting.documentsUsed.length}</div>
                    <div className="text-sm text-gray-600">Documents Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedMeeting.rating}</div>
                    <div className="text-sm text-gray-600">Meeting Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-3xl -z-10 transform -skew-y-1"></div>
          <div className="relative py-12 text-center">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-lg text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5" />
                Meeting History
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Meeting</span> Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Review your AI-powered meetings, insights, and knowledge discoveries
            </p>
          </div>
        </div>

        {/* Enhanced Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">{meetings.length}</div>
            <div className="text-sm font-medium text-blue-600">Total Meetings</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-700 mb-1">
              {meetings.reduce((acc, m) => acc + parseInt(m.duration), 0)}m
            </div>
            <div className="text-sm font-medium text-green-600">Total Duration</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-1">
              {meetings.reduce((acc, m) => acc + m.aiInsights, 0)}
            </div>
            <div className="text-sm font-medium text-purple-600">AI Insights</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-700 mb-1">
              {(meetings.reduce((acc, m) => acc + m.rating, 0) / meetings.length).toFixed(1)}
            </div>
            <div className="text-sm font-medium text-orange-600">Avg Rating</div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search meetings, topics, or summaries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white font-medium"
                >
                  <option value="all">All Types</option>
                  <option value="interview">Interviews</option>
                  <option value="client">Client Calls</option>
                  <option value="technical">Technical</option>
                  <option value="team">Team Meetings</option>
                  <option value="presentation">Presentations</option>
                  <option value="consultation">Consultations</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium bg-white"
              >
                <option value="date">Sort by Date</option>
                <option value="duration">Sort by Duration</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>
        </div>
        {/* Enhanced Meetings List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Your Meetings ({filteredMeetings.length})
                </h2>
                <p className="text-sm text-gray-600">Powered by AI insights and analysis</p>
              </div>
              {filteredMeetings.length > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700 font-medium">AI Enhanced</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredMeetings.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No meetings found</h3>
                <p className="text-gray-600 mb-1">No meetings match your search criteria</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredMeetings.map((meeting) => {
                const TypeIcon = getTypeIcon(meeting.type);
                
                return (
                  <div key={meeting.id} className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1 min-w-0">
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-xl group-hover:scale-105 transition-transform duration-300">
                          <TypeIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{meeting.title}</h3>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-lg border capitalize ${getTypeColor(meeting.type)} border-current`}>
                              {meeting.type}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">{meeting.summary}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span className="font-medium">{formatDate(meeting.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{meeting.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{meeting.participants.length} participants</span>
                            </div>
                            <div className="flex items-center">
                              {renderStars(meeting.rating)}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {meeting.keyTopics.slice(0, 3).map((topic, index) => (
                              <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                                {topic}
                              </span>
                            ))}
                            {meeting.keyTopics.length > 3 && (
                              <span className="text-gray-500 text-xs font-medium">
                                +{meeting.keyTopics.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-4">
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-600">
                            {meeting.aiInsights} AI insights
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {meeting.documentsUsed.length} docs used
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleViewDetails(meeting)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download summary"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousMeetings;