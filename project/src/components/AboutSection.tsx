import React from 'react';
import { 
  Zap, 
  Brain, 
  Users, 
  Database, 
  Globe, 
  FileText,
  MessageCircle,
  Briefcase,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles
} from 'lucide-react';

const AboutSection: React.FC = () => {
  const techFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Processing",
      description: "Powered by state-of-the-art Large Language Models including Gemini AI for multimodal understanding",
      highlight: "99.9% Accuracy"
    },
    {
      icon: Database,
      title: "Lightning-Fast Retrieval",
      description: "TiDB Vector Database ensures instant access to your stored information with sub-second response times",
      highlight: "<100ms Response"
    },
    {
      icon: Globe,
      title: "Internet Integration",
      description: "Seamlessly connects to real-time web data when your local knowledge needs supplementing",
      highlight: "Always Updated"
    }
  ];

  const keyBenefits = [
    "Eliminate awkward pauses during important conversations",
    "Access comprehensive project details instantly",
    "Maintain professional confidence in any meeting",
    "Never miss important details from your documentation",
    "Reduce preparation time by 80%"
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section with Gradient Accent */}
        <div className="text-center mb-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-3xl -z-10 transform -skew-y-1"></div>
          <div className="relative py-16">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 text-lg text-blue-600 font-medium mb-4 bg-blue-50 px-4 py-2 rounded-full">
                <Sparkles className="w-5 h-5" />
                About LuminaSync
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Lumina</span>
              <span className="text-gray-900">Sync</span>
            </h1>
            <div className="max-w-5xl mx-auto">
              <p className="text-2xl md:text-3xl text-gray-700 font-light leading-relaxed mb-8">
                The AI-powered meeting assistant that transforms your conversations into 
                <span className="font-medium text-blue-600"> confident, informed discussions</span>
              </p>
              <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
                LuminaSync listens to ongoing conversations, understands questions in real time, and instantly 
                fetches precise answers from your project files, documents, or notes.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack with Enhanced Cards */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powered by Cutting-Edge Technology</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LuminaSync combines the best of AI reasoning and lightning-fast data retrieval
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {techFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative">
                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-200">
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {feature.highlight}
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Benefits Section */}
        <div className="mb-24">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose LuminaSync?</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {keyBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Uses with Enhanced Design */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="text-2xl">🔑</span> Perfect For Every Professional Scenario
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From high-stakes interviews to critical client meetings
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Technical Interviews</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Confidently discuss complex projects, recall specific implementation details, 
                and answer technical questions with precision. Never struggle to remember 
                architecture decisions or code specifics again.
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <span>Boost confidence by 90%</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:scale-105">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Meetings</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Stay focused on strategic discussions while AI handles information retrieval. 
                Instantly surface relevant documents, previous decisions, and project context 
                without breaking conversation flow.
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                <span>Save 2+ hours per meeting</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:scale-105">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Client Presentations</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Deliver compelling presentations with real-time access to case studies, 
                technical specifications, and business metrics. Respond to unexpected 
                questions with authoritative, data-backed answers.
              </p>
              <div className="flex items-center text-green-600 font-medium">
                <span>Increase success rate by 75%</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof & Value Proposition */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-12 text-white text-center">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              "Like Having Your Smartest Colleague Always By Your Side"
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed max-w-4xl mx-auto mb-8">
              Join thousands of professionals who never feel unprepared in important conversations. 
              LuminaSync transforms every meeting into a confident, informed discussion where you 
              have instant access to everything you need to know.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">95%</div>
                <div className="text-blue-100">Confidence Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">3x</div>
                <div className="text-blue-100">Faster Information Access</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">80%</div>
                <div className="text-blue-100">Preparation Time Saved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Professional Conversations?</h3>
            <p className="text-blue-100 text-lg mb-8">Start your journey to confident, informed meetings today</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;